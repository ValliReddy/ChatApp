import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import './chatApp.css';

const ChatApp = () => {
  return (
    <div className="container">
      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card chat-app">
            {/* People List */}
            <div id="plist" className="people-list">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="fa fa-search"></i>
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                />
              </div>
              <ul className="list-unstyled chat-list mt-2 mb-0">
                {[
                  {
                    name: "Vincent Porter",
                    status: "left 7 mins ago",
                    img: "https://bootdey.com/img/Content/avatar/avatar1.png",
                    online: false,
                  },
                  {
                    name: "Aiden Chavez",
                    status: "online",
                    img: "https://bootdey.com/img/Content/avatar/avatar2.png",
                    online: true,
                  },
                  // Additional list items can be added here
                ].map((user, index) => (
                  <li key={index} className={`clearfix ${user.online ? "active" : ""}`}>
                    <img src={user.img} alt="avatar" />
                    <div className="about">
                      <div className="name">{user.name}</div>
                      <div className="status">
                        <i
                          className={`fa fa-circle ${
                            user.online ? "online" : "offline"
                          }`}
                        ></i>{" "}
                        {user.status}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Chat Section */}
            <div className="chat">
              <div className="chat-header clearfix">
                <div className="row">
                  <div className="col-lg-6">
                    <a
                      href="#view_info"
                      data-toggle="modal"
                      className="d-flex align-items-center"
                    >
                      <img
                        src="https://bootdey.com/img/Content/avatar/avatar2.png"
                        alt="avatar"
                      />
                      <div className="chat-about ml-2">
                        <h6 className="mb-0">Aiden Chavez</h6>
                        <small>Last seen: 2 hours ago</small>
                      </div>
                    </a>
                  </div>
                  <div className="col-lg-6 d-flex justify-content-end">
  {["camera", "image", "cogs", "question"].map((icon, idx) => (
    <button
      key={idx}
      className={`btn btn-outline-${icon === "question" ? "warning" : "primary"}`}
    >
      <i className={`fa fa-${icon}`}></i>
    </button>
  ))}
</div>

                </div>
              </div>
              {/* Chat History */}
              <div className="chat-history">
                <ul className="list-unstyled">
                  <li className="clearfix">
                    {/* <div className="message-data text-right">
                      <span className="message-data-time">10:10 AM, Today</span>
                      <img
                        src="https://bootdey.com/img/Content/avatar/avatar7.png"
                        alt="avatar"
                      />
                    </div> */}
                    <div className="message other-message float-right">
                      Hi Aiden, how are you? How is the project coming along?
                    </div>
                  </li>
                  <li className="clearfix">
                    <div className="message-data">
                      <span className="message-data-time">10:12 AM, Today</span>
                    </div>
                    <div className="message my-message">Are we meeting today?</div>
                  </li>
                  <li className="clearfix">
                    <div className="message-data">
                      <span className="message-data-time">10:15 AM, Today</span>
                    </div>
                    <div className="message my-message">
                      Project has been already finished and I have results to
                      show you.
                    </div>
                  </li>
                </ul>
              </div>
              {/* Chat Message Input */}
              <div className="chat-message clearfix">
                <div className="input-group mb-0">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fa fa-send"></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter text here..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
