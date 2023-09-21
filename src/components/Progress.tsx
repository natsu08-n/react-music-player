import React from 'react';
import "../styles/Progress.css";

type ProgressProps = {
    value: number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    progressSeekStart: () => void;
    progressSeekEnd: (e: React.ChangeEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>) => void;
    timeElapsed: string;
    songLength: string;
}

const Progress = ({
    value,
    onChange,
    progressSeekStart,
    progressSeekEnd,
    timeElapsed,
    songLength,
}: ProgressProps) => {
    return (
        <div className="progress">
            {/* スライダー */}
            <input 
                type="range"
                aria-label="Progress slider"
                value={value}
                min="0"
                max="100"
                className="progress__slider"
                onChange={onChange}
                style={{background: `linear-gradient(90deg, var(--primary-color) ${Math.ceil(value)}%, transparent ${Math.ceil(value)}%)`}} 
                onTouchStart={progressSeekStart}
                onMouseDown={progressSeekStart}
                onTouchEnd={progressSeekEnd}
                onClick={progressSeekEnd}
                />
                {/* 経過時間と曲の長さ */}
                <div className="progress__time">
                    <span className="progress__timeElapsed">{timeElapsed}</span>
                    <span className="progress__timeLength">{songLength}</span>
                </div>
        </div>
    )
}

export default Progress;