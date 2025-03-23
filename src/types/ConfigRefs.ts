import React from "react";
import { Config } from "~/types/generated/liveorlive_server";

export type ConfigRefs = {
    [K in keyof Config]: React.MutableRefObject<Config[K]>;
};

export type ConfigRefsWithSeparators = ConfigRefs & {
    [key in `sep${string}`]: null;
};