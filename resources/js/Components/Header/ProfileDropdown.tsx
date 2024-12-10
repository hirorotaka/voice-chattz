import { Link, router, usePage } from "@inertiajs/react";
import { Dropdown } from "flowbite-react";

const ProfileDropdown = () => {
    const { auth } = usePage().props;
    const handleLogout = () => {
        router.post(route("logout"));
    };

    console.log(auth);

    return (
        <Dropdown
            label={
                <span className="hidden sm:block">
                    {auth.user?.name || "メニュー"}
                </span>
            }
            dismissOnClick={false}
            inline
        >
            <Dropdown.Divider />
            <Link href={route("top")}>
                <Dropdown.Item>TOP</Dropdown.Item>
            </Link>
            <Link href={route("roles.index")}>
                <Dropdown.Item>役割一覧(自分)</Dropdown.Item>
            </Link>
            <Link href={route("roles.public")}>
                <Dropdown.Item>役割一覧(公開中)</Dropdown.Item>
            </Link>
            <Dropdown.Item onClick={handleLogout}>ログアウト</Dropdown.Item>
        </Dropdown>
    );
};

export default ProfileDropdown;
