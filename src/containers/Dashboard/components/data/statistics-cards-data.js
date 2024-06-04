
import {
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
  NewspaperIcon,


} from "@heroicons/react/24/solid";
import { MdFiberNew } from "react-icons/md";
export const statisticsCardsData = [

  {
    color: "gray",
    icon: NewspaperIcon,
    title: "Tổng bài đăng",
    value: "2,300",
    footer: {
      color: "text-green-500",
      value: "+3%",
      label: "Hơn tháng trước",
    },
  },
  {
    color: "gray",
    icon: MdFiberNew,
    title: "Bài đăng tháng này",
    value: "$103,430",
    footer: {
      color: "text-green-500",
      value: "+5%",
      label: "So với hôm qua",
    },
  },
  {

    color: "gray",
    icon: UsersIcon,
    title: "Tổng người dùng",
    value: "79",
    footer: {
      color: "text-green-500",
      value: "+55%",
      label: "Hơn tuần trước",
    },
  },
  {
    color: "gray",
    icon: UserPlusIcon,
    title: "Người dùng mới trong tháng",
    value: "62",
    footer: {
      color: "text-red-500",
      value: "-2%",
      label: "So với hôm qua",
    },
  },

];

export default statisticsCardsData;