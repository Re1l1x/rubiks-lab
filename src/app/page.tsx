import Image from "next/image";
import styles from "./page.module.css";
import GltfModel from "../components/GltfModel";

export default function Home() {
    return (
        <div>
            <GltfModel />
        </div>
    );
}
