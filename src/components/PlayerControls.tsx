import React from 'react';

import {
    PauseCircle,
    PlayCircle,
    Repeat,
    Repeat1,
    Shuffle,
    SkipEnd,
    SkipStart,
} from "react-bootstrap-icons";

import "../styles/PlayerControls.css";

type PlayerControlsProps = {
    isPlaying: boolean;
    toggleIsPlaying: () => void;
    prev: () => void;
    next: () => void;
    repeat: boolean;
    toggleRepeat: () => void;
    shuffle: boolean;
    toggleShuffle: () => void;
}

const CENTER_CONTROL_SIZE = 47;
const SIDE_CONTROL_SIZE = 25;

const PlayerControls = ({
    isPlaying,
    toggleIsPlaying,
    prev,
    next,
    repeat,
    toggleRepeat,
    shuffle,
    toggleShuffle,
} : PlayerControlsProps) => {
    const centerControlSize = CENTER_CONTROL_SIZE;
    const sideControlSize = SIDE_CONTROL_SIZE;

    return (
        <div className="playerControls">

            {/* シャッフルボタン */}
            <button
                aria-label={shuffle ? "Disable shuffle" : "Enable shuffle"}
                className="shuffle"
                onClick={toggleShuffle}
            >
                <Shuffle className="playerControls__icon" size={sideControlSize} />
                {shuffle && <div className="dot"/>}
            </button>

            {/* 中央のボタン３種（前へ・Enter・次へ） */}
            <div className="playerControls__main">
                <button aria-label="previous" onClick={prev}>
                    <SkipStart className="playerControls__icon" size={centerControlSize}/>
                </button>
                <button
                    aria-label={isPlaying ? "Pause" : "Play"}
                    onClick={toggleIsPlaying}
                >
                    {!isPlaying && (
                        <PlayCircle className="playerControls__icon" size={centerControlSize} />
                    )}
                    {isPlaying && (
                        <PauseCircle className="playerControls__icon" size={centerControlSize} />
                    )}
                </button>
                <button aria-label="Next" onClick={next}>
                    <SkipEnd className="playerControls__icon" size={centerControlSize} />
                </button>
            </div>

            {/* リピートボタン */}
            <button
                aria-label={repeat ? "Disable repeat" : "Enable repeat"}
                onClick={toggleRepeat}
            >
                {!repeat && <Repeat className="playerControls__icon" size={sideControlSize} />}
                {repeat && (
                    <>
                    <Repeat1 className="playerControls__icon" size={sideControlSize} />
                    <div className="dot"/>
                    </>
                )}
            </button>

        </div>
    );
};

export default PlayerControls;