import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
            <div className="max-w-3xl mx-auto space-y-8">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Política de Privacidad</h1>
                    <p className="text-gray-500">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
                </header>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">1. Introducción</h2>
                    <p>
                        En Tincadia ("nosotros", "nuestro"), respetamos su privacidad y estamos comprometidos a proteger sus datos personales.
                        Esta Política de Privacidad explica cómo recopilamos, usamos y compartimos su información cuando utiliza nuestra aplicación y sitio web.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">2. Información que Recopilamos</h2>
                    <p>Podemos recopilar los siguientes tipos de información:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Información de la Cuenta:</strong> Nombre, correo electrónico, foto de perfil (obtenida a través de Google/Apple Sign-In o registro directo).</li>
                        <li><strong>Contactos:</strong> Si otorga permiso, podemos acceder a su lista de contactos para ayudarle a encontrar amigos en Tincadia.</li>
                        <li><strong>Datos de Uso:</strong> Información sobre cómo interactúa con nuestra aplicación (registros de actividad, diagnósticos).</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">3. Uso de la Información</h2>
                    <p>Utilizamos su información para:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Proporcionar, mantener y mejorar nuestro Servicio.</li>
                        <li>Procesar transacciones y enviar notificaciones relacionadas.</li>
                        <li>Facilitar la comunicación entre usuarios.</li>
                        <li>Detectar, prevenir y abordar problemas técnicos o de seguridad.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">4. Compartir Información</h2>
                    <p>
                        No vendemos sus datos personales. Podemos compartir su información con:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Proveedores de Servicios:</strong> Terceros que nos ayudan a operar el servicio.</li>
                        <li><strong>Requisitos Legales:</strong> Si es requerido por ley o para proteger nuestros derechos.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">5. Seguridad de los Datos</h2>
                    <p>
                        Implementamos medidas de seguridad razonables para proteger su información, pero recuerde que ningún método de transmisión
                        por Internet es 100% seguro.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">6. Sus Derechos</h2>
                    <p>
                        Dependiendo de su jurisdicción, puede tener derecho a acceder, corregir, eliminar o restringir el uso de sus datos personales.
                        Puede ejercer estos derechos desde la configuración de la aplicación o contactándonos.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">7. Cambios a esta Política</h2>
                    <p>
                        Podemos actualizar nuestra Política de Privacidad periódicamente. Le notificaremos cualquier cambio publicando la nueva política en esta página.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">8. Contacto</h2>
                    <p>
                        Si tiene preguntas sobre esta Política de Privacidad, contáctenos en: privacidad@tincadia.com
                    </p>
                </section>
            </div>
        </div>
    );
}
