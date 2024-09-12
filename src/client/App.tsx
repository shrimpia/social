import React from "react";
import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import routes from "~react-pages";
import { DefaultLayout } from "./components/layouts/DefaultLayout";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ja';

dayjs.extend(relativeTime);
dayjs.locale('ja');

export const App = () => {
    const route = useRoutes(routes);

    return (
        <DefaultLayout>
            <Suspense fallback={<p>Loading...</p>}>
                {route}
            </Suspense>
        </DefaultLayout>
    );
};