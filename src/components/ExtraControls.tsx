import React from 'react';


type ExtraControlsProps = {
    children: React.ReactNode;
}

// propとして、音量調節とビジュアライザーコンポーネントを受け取る
const ExtraControls = ({children}: ExtraControlsProps) => {
    return <div className="extraControls">{children}</div>
};

export default ExtraControls;