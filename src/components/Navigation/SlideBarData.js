import * as IoIcons from "react-icons/io";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/",
    icon: <IoIcons.IoMdAnalytics />,
    cName: "nav-text",
    end: false,
    options: {},
  },
  {
    title: "Reservations",
    path: "/reservations",
    icon: <IoIcons.IoMdCalendar />,
    cName: "nav-text",
    end: false,
    options: {},
  },
  {
    title: "Services",
    path: "/services",
    icon: <IoIcons.IoMdBriefcase />,
    cName: "nav-text",
    end: false,
    options: {},
  },
  {
    title: "Language",
    path: "/",
    icon: <IoIcons.IoMdGlobe />,
    cName: "select-text",
    end: true,
    // options: [
    //   { name: "getPortugueseOption", value: "pt" },
    //   { name: "getEnglishOption", value: "en" },
    // ],
    options: {
      siglas: ["PT", "GB"],
      nomes: {"PT": 'getPortugueseLanguage', "GB": 'getEnglishLanguage'},
    },
  },
  {
    title: "Logout",
    path: "/login",
    icon: <IoIcons.IoMdLogOut />,
    cName: "nav-text",
    end: true,
    options: {},
  },
];
