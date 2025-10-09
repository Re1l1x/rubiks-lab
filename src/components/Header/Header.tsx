"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

const Header = () => {
    const pathname = usePathname();

    return (
        <div className={styles.header}>
            <div className={styles.logo}>
                <Link href="/" className={styles.link}>
                    <Image src="/images/logo.svg" alt="Logo" width={36} height={36} priority />
                </Link>
            </div>
            <div className={styles.navbar}>
                <div className={`${styles.navItem} ${pathname === "/education" ? styles.active : ""}`}>
                    <Link href="/education">Education</Link>
                </div>
                <div className={`${styles.navItem} ${pathname === "/introduction" ? styles.active : ""}`}>
                    <Link href="/introduction">Introduction</Link>
                </div>
                <div className={`${styles.navItem} ${pathname === "/test" ? styles.active : ""}`}>
                    <Link href="/test">Test</Link>
                </div>
            </div>
        </div>
    );
};

export default Header;
