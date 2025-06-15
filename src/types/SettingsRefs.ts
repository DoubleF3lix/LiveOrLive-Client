import React from "react";
import { Settings } from "~/types/generated/liveorlive_server.Models";

export type SettingsRefs = {
    [K in keyof Settings]: React.MutableRefObject<Settings[K]>;
};