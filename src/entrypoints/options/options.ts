import "../../app.css";
import Options from "@/entrypoints/options/Options.svelte";
import { mount } from "svelte";

const appElement = document.getElementById("app");

if (!appElement) {
    throw new Error("Failed to find app element. Cannot mount options page.");
}

mount(Options, {
    target: appElement,
});
