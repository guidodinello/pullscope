import "../../app.css";
import Popup from "@/entrypoints/popup/Popup.svelte";
import { mount } from "svelte";

const appElement = document.getElementById("app");

if (!appElement) {
    throw new Error("Failed to find app element. Cannot mount popup.");
}

mount(Popup, {
    target: appElement,
});
