import React from "react";
import {AvatarImage} from "./avatar";

interface UserTileProps {
    name: string;
    avatarUrl?: string;
    subtitle?: string;
    onClick?: () => void;
}

const UserTile: React.FC<UserTileProps> = ({ name, avatarUrl, subtitle, onClick }) => (
    <div
        className="flex items-center gap-3 p-3 rounded hover:bg-gray-100 cursor-pointer transition"
        onClick={onClick}
    >
        <AvatarImage src={avatarUrl} alt={name} />
        <div>
            <div className="font-medium">{name}</div>
            {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
        </div>
    </div>
);

export default UserTile;