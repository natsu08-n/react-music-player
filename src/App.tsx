import React, {useEffect, useRef, useState} from "react";
import {Soundwave} from "react-bootstrap-icons";


// コンポーネント
import ExtraControls from "./components/ExtraControls";
import PlayerControls from "./components/PlayerControls";
import Progress from "./components/Progress";
import SongDetails from "./components/SongDetails";
import Volume from "./components/Volume";

interface Song {
    id: number;
    title: string;
    artist: string;
    image: string;
    src: string;
}

const songs: Song[] = [
    {
        id: 0,
        title: "1. Purple Gum",
        artist: "David Martinez",
        image: "https://res.cloudinary.com/dy6xgbutr/image/upload/v1693758355/Photos/hiep-duong-mm6VFRGTqWk-unsplash_hqrjqg.webp",
        src: "https://res.cloudinary.com/dy6xgbutr/video/upload/v1693754662/music/Purple_Gum_xp8nuu.mp3",
        
    },
    {
        id: 1,
        title: "2. Gray Beat",
        artist: "Lucy",
        image: "https://res.cloudinary.com/dy6xgbutr/image/upload/v1693758350/Photos/aideal-hwa-OYzbqk2y26c-unsplash_gg75hn.webp",
        src: "https://res.cloudinary.com/dy6xgbutr/video/upload/v1693755372/music/Gray_Beat_n1ofia.mp3",
        
    },
    {
        id: 2,
        title: "3. Blue Neon",
        artist: "Rebecca",
        image: "https://res.cloudinary.com/dy6xgbutr/image/upload/v1693758360/Photos/sandro-katalina-k1bO_VTiZSs-unsplash_bwjgw1.webp",
        src: "https://res.cloudinary.com/dy6xgbutr/video/upload/v1693757249/music/Blue_Neon_cnazry.mp3",
        
    },
    {
        id: 3,
        title: "4. Violet Basement",
        artist: "T-bug",
        image: "https://res.cloudinary.com/dy6xgbutr/image/upload/v1695207533/Photos/jeremy-thomas-jh2KTqHLMjE-unsplash_ov9qnv.webp",
        src: "https://res.cloudinary.com/dy6xgbutr/video/upload/v1695206628/music/Violet_Basement_hccbr4.mp3",
        
    },
];

class AudioAnalyser {
    context: AudioContext;
    analyserNode: AnalyserNode;
    source: MediaElementAudioSourceNode;
    constructor(audioElement: HTMLAudioElement) {
        //新しいAudioContextインスタンスを作成 -> Web Audio APIを動かすための土台を作成
        this.context = new (window.AudioContext)();
        //新しいAnalyserNodeインスタンスを作成 -> 音声データの波形や周波数情報を解析するためのオブジェクト
        this.analyserNode = this.context.createAnalyser();
        //新しいMediaElementAudioSourceNodeインスタンスを作成 -> 与えられたHTMLメディアエレメント（audioElement）から音声データを取り込む
        this.source = this.context.createMediaElementSource(audioElement);
        //sourceをAnalyserNodeインスタンスに接続 -> HTMLMediaElementからの音声データがAnalyserNodeに送られ、解析できるようになる
        this.source.connect(this.analyserNode);
        //AnalyserNodeインスタンスをAudioContextのdestinationに接続 -> 解析された音声データが最終的な出力（通常はスピーカーまたはヘッドフォン）へ送信される
        this.analyserNode.connect(this.context.destination);
    }
}

function App() {
    const audioRef = useRef<HTMLAudioElement| null>(null);
    const [playlist, setPlaylist] = useState<Song[]>(songs);
    const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
    const [progress, setProgress] = useState<number>(0);
    const [dragging, setDragging] = useState<boolean>(false);
    const [timeElapsed, setTimeElapsed] = useState<number>(0);
    const [songLength, setSongLength] = useState<number>(0);
    const [songFinished, setSongFinished] = useState<boolean>(false);
    const [repeat, setRepeat] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(0.7);
    const [visualizer, setVisualizer] = useState<boolean>(false);
    const [shuffle, setShuffle] = useState<boolean>(false);
    const [shuffledPlaylist, setShuffledPlaylist] = useState<Song[]>(songs);
    const [analyser, setAnalyser] = useState<AudioAnalyser | null>(null);


    const setTimeUpdate = () => {
        const audio = audioRef.current;
        const currentTime = audio?.currentTime;
        const progress = currentTime ? Number(((currentTime * 100) / audio?.duration).toFixed(1)) : 0;

        setTimeElapsed(currentTime || 0);
        !dragging && setProgress(progress);
    };

    const setLoadedData = async () => {
        try {
            const audio = audioRef.current;
            if(!analyser && audio) {
                setAnalyser(new AudioAnalyser(audio));
            }
            setTimeElapsed(audio?.currentTime || 0);
            setSongLength(audio?.duration || 0);
        } catch(e) {
            console.error("Error while loading data: ", e);
        }
    };

    //前または次の曲の再生を開始する
    const playSong = async () => {
        try {
            await analyser?.context.resume();
            setIsPlaying(true);
            await audioRef?.current?.play();
        } catch(e) {
            console.error("Error while playing the song: ", e);
        }
        
    };

    //プレイリストの曲をシャッフルする
    const shufflePlaylist = () => {
        //シャッフルされたプレイリストの状態を更新
        setShuffledPlaylist((playlist) => {
            if(playlist.length === 1) return playlist;

            const newPlaylist = playlist.filter(
                (song) => song.id !== playlist[currentSongIndex].id
            );

            let shuffledPlaylist = newPlaylist.sort(() => Math.random() - 0.5);

            shuffledPlaylist = [
                playlist[currentSongIndex],
                ...shuffledPlaylist,
            ];
            return shuffledPlaylist;
        });
    };

    function getNewPlaylist(shuffle: boolean, shuffledPlaylist: Song[], songs: Song[]) {
        return shuffle ? shuffledPlaylist : songs;
    }

    function getNewIndex(currentIndex: number, step: number, length: number) {
        const newIndex = currentIndex + step;
        if(newIndex >= length) {
            return 0;
        }
        if(newIndex < 0) {
            return length - 1;
        }
        return newIndex;
    }

    function updateSongIndex(step: number) {
        const currentSongId = playlist[currentSongIndex].id;
        const newPlaylist = getNewPlaylist(shuffle, shuffledPlaylist, songs);
        setPlaylist(newPlaylist);
        setCurrentSongIndex(() => { 
            const currentSongIndex = newPlaylist.findIndex((song) => song.id === currentSongId);
            return getNewIndex(currentSongIndex, step, newPlaylist.length);
        });
        playSong();
    }

    const next = () => {
        updateSongIndex(1);
    };

    const prev = () => {
        updateSongIndex(-1);
    };

    //再生中の曲の現在時刻を更新
    const updateCurrentTime = (value: number): void => {
        const audio = audioRef.current;
        if(audio) {
            const currentTime = (value * audio.duration) / 100;
            audio.currentTime = currentTime;
        }
    };

    //曲の特定の時刻をシークする
    const progressSeekEnd  = (e: React.ChangeEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>) => {
        if (e.target instanceof HTMLInputElement) {  //e.target.value を安全にアクセス
            updateCurrentTime(Number(e.target.value));
            setDragging(false);
        }
    };

    //現在の曲の時間を、分と秒の文字列にフォーマット
    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time - minutes * 60);
        return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    };

    useEffect(() => {
        if(audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        const playOrPause = async () => {
            try {
                if(isPlaying) {
                    await analyser?.context?.resume();
                    await audioRef?.current?.play();
                } else {
                    audioRef?.current?.pause();
                }
            } catch(e) {
                console.error("Error while playing or pausing the song: ", e);
            }
        };

        playOrPause();
    }, [isPlaying, analyser?.context]);

    useEffect(() => {
        if (songFinished) {
            if (!repeat) next();
            setSongFinished(false);
        }
    }, [songFinished]);

    useEffect(() => {
        if(shuffle) shufflePlaylist();
    }, [shuffle]);


    return (
        <div className="app">
            <audio
                src={playlist[currentSongIndex].src}
                ref={audioRef}
                onTimeUpdate={setTimeUpdate}//再生位置の更新時
                onLoadedData={setLoadedData}//メディア再生準備出来た時
                onEnded={() => setSongFinished(true)} //再生終了時
                loop={repeat}
                crossOrigin="anonymous"//クロスオリジンのリクエストに対して認証情報を送信しない
            >
            </audio>
            <div className="layout">
                <SongDetails 
                    visualizer={visualizer}
                    source={analyser?.source}
                    analyser={analyser?.analyserNode}
                    currentSongIndex={currentSongIndex}
                    song={playlist[currentSongIndex]}
                />

                <ExtraControls>
                    {/* 音量調節コンポーネント */}
                    <Volume
                        value={volume * 100}
                        onChange={(e) => setVolume(Number(e.target.value) / 100)}
                    />

                    {/* ビジュアライザーコンポーネント */}
                    <button
                        aria-label={visualizer ? "Disable visualizer" : "Enable visualizer"}
                        onClick={() => setVisualizer((prev) => !prev)}
                    >
                        <Soundwave color="var(--primary-color)" size={25}/>
                        {visualizer && <div className="dot"/>}
                    </button>
                </ExtraControls>

                <Progress 
                    value={progress}
                    onChange={(e) => { setProgress(Number(e.target.value)); }}
                    progressSeekStart={() => setDragging(true)}
                    progressSeekEnd={progressSeekEnd}
                    timeElapsed={formatTime(timeElapsed)}
                    songLength={formatTime(songLength)}
                />
                <PlayerControls
                    prev={prev}
                    next={next}
                    isPlaying={isPlaying}
                    toggleIsPlaying={() => setIsPlaying((isPlaying) => !isPlaying)}
                    shuffle={shuffle}
                    toggleShuffle={() => setShuffle((shuffle) => !shuffle)}
                    repeat={repeat}
                    toggleRepeat={() => setRepeat((repeat) => !repeat)}
                />
            </div>
        </div>
    );
}

export default App;