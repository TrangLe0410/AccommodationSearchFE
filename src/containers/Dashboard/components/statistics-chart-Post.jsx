import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import PropTypes from "prop-types";
import Chart from "react-apexcharts";
import { apiGetCountPostByMoth } from '../../../services/post'; // Importing the API function
import chartsConfig from '../../../configs/charts-config';

export function StatisticsChartPost({ color, title, description, footer }) {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiGetCountPostByMoth(); // Fetch data from API
                if (response && response.data && response.data.counts) {
                    const dataFromApi = response.data.counts.map(item => item.count);
                    setChartData({
                        type: "line",
                        height: 280,
                        series: [{ data: dataFromApi }],
                        options: {
                            ...chartsConfig,
                            colors: ["#388e3c"],
                            stroke: { lineCap: "round" },
                            markers: { size: 5 },
                            xaxis: {
                                ...chartsConfig.xaxis,
                                categories: [
                                    "Tháng 1",
                                    "Tháng 2",
                                    "Tháng 3",
                                    "Tháng 4",
                                    "Tháng 5",
                                    "Tháng 6",
                                    "Tháng 7",
                                    "Tháng 8",
                                    "Tháng 9",
                                    "Tháng 10",
                                    "Tháng 11",
                                    "Tháng 12",
                                ],
                            },

                        },
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Card className="border border-blue-gray-100 shadow-sm">
            <CardHeader variant="gradient" color={color} floated={false} shadow={false}>
                {chartData && <Chart {...chartData} />}
            </CardHeader>
            <CardBody className="px-6 mt-7 pt-0">
                <Typography variant="h4" color="blue-gray">
                    Thống kê bài đăng
                </Typography>
                <Typography variant="small" className="font-normal text-blue-gray-600">
                    Thống kê bài đăng từng tháng trong năm
                </Typography>
            </CardBody>
        </Card>
    );
}

StatisticsChartPost.defaultProps = {
    color: "blue",
    footer: null,
};

StatisticsChartPost.propTypes = {
    color: PropTypes.oneOf([
        "white", "blue-gray", "gray", "brown", "deep-orange", "orange", "amber",
        "yellow", "lime", "light-green", "green", "teal", "cyan", "light-blue",
        "blue", "indigo", "deep-purple", "purple", "pink", "red",
    ]),
    title: PropTypes.node.isRequired,
    description: PropTypes.node.isRequired,
    footer: PropTypes.node,
};

export default StatisticsChartPost;
