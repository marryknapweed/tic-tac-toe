import "./index.css"

export function OnlineGameType () {

    const title = "Select the mode"
    const buttonText_Host = "Create room"
    const buttonText_Connect = "Connect to room"

    const pahts = {
        Host: "/lobby/create",
        Connect: "/lobby/connect"
    };

    const handleButtonClick = (mode) => {

    };

    
    return (
        <div className='choose-wrapper'>
            <div className='choose'>
                <h2>{title}</h2>
                <div className='buttons-group'>
                    <button 
                        type="button" 
                        className="auth-button" 
                        onClick={() => handleButtonClick('Host')}
                    >
                        {buttonText_Host}
                    </button>
                    <button 
                        type="button" 
                        className="auth-button" 
                        onClick={() => handleButtonClick('Connect')}
                    >
                        {buttonText_Connect}
                    </button>
                </div>
            </div>
        </div>
    );
}