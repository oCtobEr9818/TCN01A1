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

  return (
    <>
      <input type="checkbox" id="collapse-control" />

      <label htmlFor="collapse-control">
        <div className="menu-line"></div>
      </label>

      <div className="nav-container">
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
      </div>
    </>
  );
};
