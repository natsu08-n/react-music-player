//曲の画像、曲名、アーティスト名、ビジュアライザー
import React from "react";
import SongImage from "./SongImage";
import Visualizer from "./Visualizer";

import "../styles/SongDetails.css";

type Song = {
    image: string;
    title: string;
    artist: string;
}

type SongDetailsProps = {
    song: Song;
    visualizer: boolean;
    source: any;
    analyser: any;
    currentSongIndex: number;
}

const SongDetails = ({
    song,
    visualizer,
    source,
    analyser,
    currentSongIndex
}:  SongDetailsProps) => {
    return (
        <div className="songDetails">
            <div className="songDetails__imageContainer">
            {!visualizer && <SongImage url={song.image} />}
            {visualizer && (
                <Visualizer 
                    source={source}
                    analyser={analyser}
                    currentSongIndex={currentSongIndex}
                />
            )}
                
            </div>
            <div className="songDetails__info">
                <h3 className="songDetails__songName pulsate">{song.title}</h3>
                <h4 className="songDetails__artistName">{song.artist}</h4>
            </div>
        </div>
    );
};

export default SongDetails;