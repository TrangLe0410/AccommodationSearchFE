import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { apiGetCountPostByProvince } from "../../../services/post";
import chartsConfig from "../../../configs/charts-config";
import StatisticsChartPost from "./statistics-chart-Post";

export function StatisticsChart({ color, chart, title, description, footer }) {
    const [postCounts, setPostCounts] = useState([]);

    useEffect(() => {
        fetchPostCountsByProvince().then(data => {
            setPostCounts(data);
        });
    }, []);

    const fetchPostCountsByProvince = async () => {
        try {
            const response = await apiGetCountPostByProvince();
            return response.data.districtStats.map((district, index) => ({
                label: district.provinceName,
                data: district.postCount,
            }));
        } catch (error) {
            console.error('Error fetching post counts by province:', error);
            return [];
        }
    };

    const getRandomColor = () => {
        // Tạo một màu sắc ngẫu nhiên
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const updatedChartOptions = {
        ...chartsConfig,
        labels: postCounts.map(district => district.label),
        legend: {
            position: 'bottom', // Đặt chú thích ở dưới biểu đồ
        },
    };

    const updatedChartSeries = postCounts.map(district => district.data);
    const colors = postCounts.map(() => getRandomColor()); // Lấy màu sắc ngẫu nhiên cho mỗi quận

    return (
        <Card className="border border-blue-gray-100 shadow-sm">
            <CardHeader variant="gradient" color={color} floated={false} shadow={false}>
                <Chart options={{ ...updatedChartOptions, colors }} series={updatedChartSeries} type="pie" height={350} />
            </CardHeader>
            <CardBody className="px-6 mt-[-20px]">
                <Typography variant="h4" color="blue-gray">
                    {title}
                </Typography>
                <Typography variant="small" className="font-normal text-blue-gray-600">
                    {description}
                </Typography>
            </CardBody>
        </Card>
    );
}

StatisticsChart.defaultProps = {
    color: "blue",
    footer: null,
};

StatisticsChart.propTypes = {
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
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    footer: PropTypes.node,
};

StatisticsChart.displayName = "/src/widgets/charts/statistics-chart.jsx";
