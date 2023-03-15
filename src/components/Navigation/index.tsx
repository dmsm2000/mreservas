import React, { useEffect, useState } from "react";

// ICONS
import * as FaIcons from "react-icons/fa"; //Now i get access to all the icons
import * as AiIcons from "react-icons/ai";

import { IconContext } from "react-icons";

// ROUTING

import { Link, useNavigate } from "react-router-dom";

// DATA FILE
import { SidebarData } from "./SlideBarData";

import { logout } from "../../firebase";
import { useTranslation } from "react-i18next";

// import ReactFlagsSelect from "react-flags-select";

// STYLES
import "./style.css";

export default function Navbar() {
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  const [sidebar, setSidebar] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1000); // valor pode variar
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function performLogout() {
    logout(navigate);
  }
  function handleLanguageChange(code: any) {
    i18n.changeLanguage(code.toLocaleLowerCase());
  }

  interface CountryData {
    [key: string]: string;
    PT: string;
    GB: string;
  }
  function getNomes() {
    const temp: CountryData | undefined = SidebarData[SidebarData.length - 2]?.options?.nomes;
  
    if (temp) {
      Object.keys(temp).forEach((element) => {
        temp[element] = t(temp[element]);
      });
    }

    return temp;
  }
  
  const sideMenu = (
    <IconContext.Provider value={{ color: "#FFF" }}>
      <div className="navbar">
        <Link to="#" className="menu-bars">
          <FaIcons.FaBars onClick={showSidebar} />
        </Link>

        {/* <ReactFlagsSelect
          className={SidebarData[SidebarData.length - 2].cName + " end"}
          countries={SidebarData[SidebarData.length - 2].options.siglas}
          customLabels={getNomes()}
          onSelect={handleLanguageChange}
          selected={i18n.language.toLocaleUpperCase()}
        /> */}
      </div>

      <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
        <ul className="nav-menu-items" onClick={showSidebar}>
          <li className="navbar-toggle">
            <Link to="#" className="menu-bars">
              <AiIcons.AiOutlineClose />
            </Link>
          </li>

          {SidebarData.map((item, index) => {
            return (
              <li
                key={index}
                className={item.end ? item.cName + " bottom" : item.cName}
                onClick={() => (item.end ? performLogout() : null)}
              >
                <Link to={item.path}>
                  {item.icon}
                  <span>{t("get" + item.title + "Title")}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </IconContext.Provider>
  );

  const navBar = (
    <IconContext.Provider value={{ color: "#FFF" }}>
      <div className="navbar">
        <ul style={{ display: "flex", width: "100%" }}>
          {SidebarData.map((item, index) => {
            if (Object.keys(item.options).length === 0) {
              return (
                <li
                  key={index}
                  className={item.end ? item.cName + " end" : item.cName}
                  onClick={() => (item.end ? performLogout() : null)}
                >
                  <Link to={item.path}>
                    {item.icon}
                    <span>{t("get" + item.title + "Title")}</span>
                  </Link>
                </li>
              );
            } else {
              /* return (
                <li
                  key={index}
                  className={item.end ? item.cName + " end" : item.cName}
                  style={{ marginRight: "15% " }}
                >
                  <ReactFlagsSelect
                    className={item.cName}
                    countries={item.options.siglas}
                    onSelect={handleLanguageChange}
                    selected={i18n.language.toLocaleUpperCase()}
                  />
                </li>
              ); */
            }
          })}
        </ul>
      </div>
    </IconContext.Provider>
  );

  return <>{isSmallScreen ? sideMenu : navBar}</>;
}
