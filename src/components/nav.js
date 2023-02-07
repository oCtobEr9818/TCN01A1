import { useState } from "react";
import { NavLink } from "react-router-dom";
import { v4 } from "uuid";

export const Nav = () => {
  const navs = [
    {
      path: "/",
      title: "首頁",
    },
    {
      path: "/instantAnalysis",
      title: "即時分析",
    },
    {
      path: "/historyAnalysis",
      title: "歷史分析",
    },
    {
      path: "/readCSV",
      title: "讀取.csv檔",
    },
  ];

  const [isChecked, setIsChecked] = useState(false);

  const handleArrowDirect = () => {
    setIsChecked((prev) => !prev);
  };

  return (
    <>
      <input
        type="checkbox"
        id="collapse-control"
        onChange={handleArrowDirect}
      />
      <label htmlFor="collapse-control">
        {isChecked ? (
          <i className="fa fa-arrow-right" aria-hidden="true"></i>
        ) : (
          <i className="fa fa-arrow-left" aria-hidden="true"></i>
        )}
      </label>

      <div className="nav-wrap">
        <div className="logo">
          <img
            src={process.env.PUBLIC_URL + "/image/logo.png"}
            alt="明曜logo"
          />
        </div>
        <div className="nav">
          <ul>
            {navs.map((nav) => {
              return (
                <li key={v4()}>
                  <NavLink to={nav.path}>
                    <button>{nav.title}</button>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};
