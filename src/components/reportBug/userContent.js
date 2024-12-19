import { useState } from "react";
import { sendReport } from "../../utils/firestore";
import Modal from "../modal/modal";

export default function UserContent() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isShowModal, setIsShowModal] = useState(false);
    const [modalContent, setIsModalContent] = useState('');

    const sendReportToDB = async () => {
        if (title.length > 0 && description.length > 0) {
            const username = localStorage.getItem("username")
            const date = new Date()
            const data = {title, description, from: username, date};
            const res = await sendReport(data);
            if (res) {
                setDescription('');
                setTitle('');
                setIsModalContent(`Your's report "${title}" is sended to developer, thanks for feedback!`);
                setIsShowModal(true);
            } else {
                setIsModalContent("Something went wrong, please try again later...");
                setIsShowModal(true);
            }
        } else {
            setIsModalContent("Please write something in the inputs!");
            setIsShowModal(true);
        }
    };

    const toggleModal = () => {
        setIsShowModal((prev) => !prev);
    };

    return (
        <div className='choose-wrapper'>
            <Modal isOpen={isShowModal} onClose={toggleModal} content={modalContent}>
                <button className="auth-button" onClick={toggleModal}>Okay</button>
            </Modal>
            <div className='choose'>
                <h2>Report Bug Form</h2>
                <p>Describe the bug</p>
                <div className={`input-container`}>
                    <input
                        type="text"
                        placeholder="Write a title here..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className={`input-container`}>
                    <input
                        type="text"
                        placeholder="Write a description of your problem"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button type="submit" className="reset-button" onClick={sendReportToDB}>
                    Send report to developer
                </button>
            </div>
        </div>
    );
}