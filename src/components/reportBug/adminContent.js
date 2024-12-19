import { useEffect, useState } from "react";
import { getReports } from "../../utils/firestore";

export default function AdminContent() {
    const [data, setData] = useState([])

    const getData = async () => {
        const res = await getReports()
        setData(res)
    }
    console.log(data)

    useEffect(() => {
        getData()
    }, [])

    const toggleModal = () => {
        setIsShowModal((prev) => !prev);
    };

    return (
        
    <div className="game-history-container">
    <h3 className="game-history-title">User's bug reports</h3>
    {data.length > 0 ? (
        data.map((report) => (
            <li
            key={report.title}
            className="game-history-item"
          >
            <div className="game-history-details">
              <p>
                <strong>Title:</strong> {report.title}
              </p>
              <p>
                <strong>Description of problem</strong> {report.description}
              </p>
              <p>
                <strong>Sended from:</strong> {report.from}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                
                {new Date(report.date.seconds * 1000).toLocaleString()}
              </p>
            </div>
          </li>
        ))
    ) : (
      <p className="no-games-message">No reports sended yet.</p>
    )}
  </div>
    );
}