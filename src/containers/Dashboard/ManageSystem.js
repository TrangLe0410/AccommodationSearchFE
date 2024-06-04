import React from "react";
import {
    Typography,
} from "@material-tailwind/react";

import { StatisticsCard } from './components/StatisticsCard'
import { StatisticsChart } from "./components/statistics-chart";
import {
    statisticsCardsData,
} from './components/data/statistics-cards-data';
import {
    statisticsChartsData,
} from './components/data/statistics-charts-data';
import { ClockIcon } from "@heroicons/react/24/solid";
import StatisticsChartPost from "./components/statistics-chart-Post";

const ManageSystem = () => {
    return (
        <div className="mt-6">
            <div className="mb-8 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
                {statisticsCardsData.map(({ icon: Icon, title, footer, ...rest }) => (
                    <StatisticsCard
                        key={title}
                        {...rest}
                        title={title}
                        icon={<Icon className="bg-clip-border mt-4 mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-gray-900/20 absolute grid h-9 w-9 place-items-center " />}
                        footer={
                            <Typography className="font-normal text-blue-gray-600">
                                <strong className={footer.color}>{footer.value}</strong>
                                &nbsp;{footer.label}
                            </Typography>
                        }
                    />
                ))}
            </div>

            <div className=" grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
                <StatisticsChartPost />
                {statisticsChartsData.map((props) => (
                    <StatisticsChart
                        key={props.title}
                        {...props}
                        footer={
                            <Typography
                                variant="small"
                                className="flex items-center font-normal text-blue-gray-600"
                            >
                                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                                &nbsp;{props.footer}
                            </Typography>
                        }
                    />
                ))}

            </div>


        </div>
    );
}

export default ManageSystem;
