import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import ReactSlider from "react-slider";
import { socketHooks } from "../../../components/SocketProvider";
import { setPosition } from "../../../store/slices/gameSlice";
import { ReactComponent as Arrow } from "../../../assets/SVG/arrow.svg";
import NumberInput from "./NumberInput";
import CustomSelect from "./CustomSelect";
Modal.setAppElement("body");
const options = [
  {
    id: 0,
    name: "Texas NL Hold'em",
  },
  {
    id: 1,
    name: "Omaha Hold'em",
  },
];
const defaultOption = options[0];
const Main = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [roomName, setRoomName] = useState("Fake");
  const [roomType, setRoomType] = useState(defaultOption.name);
  const [buyIn, setBuyIn] = useState(21);
  const [bigBlind, setBigBlind] = useState(2);
  const [errors, setErrors] = useState({ id: 0, message: "" });

  const tableData = useSelector((state) => state.game.tableInformation);
  const balance = useSelector((state) => state.game.mainInformation.balance);
  const address = useSelector((state) => state.game.mainInformation.address);
  const handleCreate = () => {
    if (roomName.trim() == "")
      return setErrors({ id: 1, message: "* Table Name * is required!" });
    if (bigBlind * 10 > buyIn)
      return setErrors({
        id: 2,
        message: "* Buy In * must be more than 10 times * Big Blind *!",
      });
    socketHooks.emitCreateRoom({
      address,
      name: roomName,
      type: roomType,
      smallBlind: bigBlind / 2,
      bigBlind: bigBlind,
      buyIn: buyIn,
      position: 0,
    });
    dispatch(setPosition(0));
    navigate("/game");
  };

  useEffect(() => {
    socketHooks.emitJoinGame({ address: Math.random() });
    return () => {};
  }, []);
  return (
    <div id="container">
      <header>
        <img src="/images/table/logo.svg" className="logo"></img>
        <div className="action">
          <div className="info">
            <img src="/images/table/chip.png"></img>
            <div>{balance}</div>
          </div>
          <img src="/images/table/addChip.png"></img>
        </div>
        <div className="profile">
          <div className="line"> </div>
          <img src="/images/table/avatar.png"></img>
          <Arrow />
        </div>
      </header>
      <main>
        <div className="toolbar">
          <div className="tabs">
            <div className="tab active">Ring Games</div>
            <div className="tab">Tournaments</div>
            <div className="tab">Multi-Tournament</div>
            <div className="tab">Favourites</div>
          </div>
          <button
            id="btnCreate"
            onClick={() => {
              setModalOpen(true);
            }}
          >
            Create Table
          </button>
        </div>
        <div className="tab-container">
          <div className="room-table">
            <table>
              <thead>
                <tr>
                  <th>Table Name</th>
                  <th>Game Type</th>
                  <th>Stack</th>
                  <th>Buy In</th>
                  <th>Players</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, key) => {
                  return (
                    <tr key={"room" + key}>
                      <td>{item.name}</td>
                      <td>{item.type}</td>
                      <td>{item.smallBlind + "/" + item.bigBlind}</td>
                      <td>{item.minBuyIn}</td>
                      <td>{item.activePlayersCnt + "/6"}</td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          className="button-join"
                          onClick={() => {
                            socketHooks.emitEnterRoom({
                              address,
                              tableId: item.id,
                            });
                            dispatch(setPosition(-1));
                            navigate("/game");
                          }}
                        >
                          Join
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Modal
        className="table-modal"
        isOpen={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
      >
        <div className="modal-header">
          <div className="modal-title">Create New Table</div>
          <div
            className="modal-times"
            onClick={() => {
              setModalOpen(false);
            }}
          >
            &times;
          </div>
        </div>
        <div className="modal-body">
          <label>Table Name</label>
          <input
            className={errors.id == 1 ? "error" : ""}
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          ></input>
          <label>Table Type</label>
          <CustomSelect
            defaultText={defaultOption.name}
            optionsList={options}
            onSelect={(e) => {
              setRoomType(e);
            }}
          />
          <label>Buy In</label>
          <div className="buy-in">
            <div className="buy-in-slider">
              <ReactSlider
                className="table-slider"
                thumbClassName="slider-thumb"
                trackClassName="slider-track"
                markClassName="slider-mark"
                value={Number(buyIn)}
                min={1}
                max={Number(balance)}
                onChange={(e) => {
                  setBuyIn(e);
                }}
              />
            </div>
            <NumberInput
              error={errors.id == 2}
              value={buyIn}
              onChange={(e) => setBuyIn(e)}
              min={1}
              max={balance}
            />
          </div>
          <div className="stack d-flex">
            <div>
              <label>Small Blind</label>
              <NumberInput
                error={errors.id == 2}
                value={Math.floor(bigBlind / 2)}
                onChange={(e) => setBigBlind(e * 2)}
                min={1}
                max={Math.floor(balance / 2)}
              />
            </div>
            <div>
              <label>Big Blind</label>
              <NumberInput
                error={errors.id == 2}
                value={bigBlind}
                onChange={(e) => setBigBlind(Math.floor(e / 2) * 2)}
                min={2}
                max={Math.floor(balance / 2) * 2}
              />
            </div>
          </div>
          <div className="error-message">{errors.message}</div>
        </div>
        <div className="modal-footer">
          <button onClick={handleCreate}>Create</button>
        </div>
      </Modal>
    </div>
  );
};

export default Main;
