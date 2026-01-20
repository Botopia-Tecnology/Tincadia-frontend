"use client" // Obligatorio en Next.js App Router para usar useEffect

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export default function ClarityAnalytics() {
    useEffect(() => {
        // Leemos la variable de entorno
        const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

        // Verificamos que exista para evitar errores o inicializaciones vacías
        if (projectId) {
            Clarity.init(projectId);
        } else {
            console.warn("Clarity Project ID no encontrado en las variables de entorno.");
        }
    }, []);

    return null;
}