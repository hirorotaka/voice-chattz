import { Link, router, usePage } from "@inertiajs/react";
import { Dropdown } from "flowbite-react";

const ProfileDropdown = () => {
    const { auth } = usePage().props;
    const handleLogout = () => {
        router.post(route("logout"));
    };

    return (
        <Dropdown
            label={auth.user?.name || "メニュー"}
            dismissOnClick={false}
            inline
        >
            <Dropdown.Divider />
            <Link href={route("top")}>
                <Dropdown.Item>TOP</Dropdown.Item>
            </Link>
            <Link href={route("roles.index")}>
                <Dropdown.Item>役割一覧</Dropdown.Item>
            </Link>
            <Dropdown.Item onClick={handleLogout}>ログアウト</Dropdown.Item>
        </Dropdown>
    );
};

export default ProfileDropdown;
