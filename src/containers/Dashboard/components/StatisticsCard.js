import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { apiGetCountPost, apiGetCountPostByThisMoth } from "../../../services/post";
import { apiGetCountUser, apiGetCountUserByMonth } from "../../../services/user";


export function StatisticsCard({ color, icon, title }) {
  const [data, setData] = useState({ value: 0, error: null }); // State to hold count and any error

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (title === "Tổng bài đăng") {
          response = await apiGetCountPost();
        } else if (title === "Bài đăng tháng này") {
          response = await apiGetCountPostByThisMoth();
        } else if (title === "Tổng người dùng") {
          response = await apiGetCountUser();
        } else if (title === "Người dùng mới trong tháng") {
          response = await apiGetCountUserByMonth();
        } else {
          return;
        }

        if (response.status === 200) {
          setData({ value: response.data.count, error: null });
        } else {
          console.error('Error fetching count:', response);
          setData({ value: 0, error: 'Error fetching data' });
        }
      } catch (error) {
        console.error('Error fetching count:', error);
        setData({ value: 0, error: 'Error fetching data' });
      }
    };

    fetchData();
  }, [title]);

  return (
    <Card className="border border-blue-gray-100 shadow-sm">
      <CardHeader
        variant="gradient"
        color={color}
        floated={false}
        shadow={false}
        className="absolute grid h-12 w-12 place-items-center"
      >
        {icon}
      </CardHeader>
      <CardBody className="p-4 text-right">
        <Typography variant="small" className="font-normal text-blue-gray-600">
          {title}
        </Typography>
        {data.error ? (
          <Typography variant="h4" color="red">
            {data.error}
          </Typography>
        ) : (
          <Typography variant="h4" color="blue-gray">
            {data.value}
          </Typography>
        )}
      </CardBody>
    </Card>
  );
}

StatisticsCard.defaultProps = {
  color: "blue",
  footer: null,
};

StatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    "white",
    "blue-gray",
    "gray",
    "brown",
    "deep-orange",
    "orange",
    "amber",
    "yellow",
    "lime",
    "light-green",
    "green",
    "teal",
    "cyan",
    "light-blue",
    "blue",
    "indigo",
    "deep-purple",
    "purple",
    "pink",
    "red",
  ]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  footer: PropTypes.node,
};

StatisticsCard.displayName = "/src/widgets/cards/statistics-card.jsx";

export default StatisticsCard;
