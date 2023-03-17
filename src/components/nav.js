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
      path: "/readCSV",
      title: "讀取.csv檔",
    },
  ];

  // 控制選單收合的箭頭方向
  const [isChecked, setIsChecked] = useState(false);
  const handleArrowDirect = () => setIsChecked((prev = true) => !prev);

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
        <div className="menu-line"></div>
        <div className="menu-line1"></div>
        <div className="menu-line2"></div>
        <div className="menu-line3"></div>
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
