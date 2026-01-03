import React from 'react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
            <div className="max-w-3xl mx-auto space-y-8">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Términos de Servicio</h1>
                    <p className="text-gray-500">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
                </header>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">1. Aceptación de los Términos</h2>
                    <p>
                        Bienvenido a Tincadia. Al descargar, instalar o utilizar nuestra aplicación móvil y sitio web ("el Servicio"),
                        usted acepta regirse por estos Términos de Servicio. Si no está de acuerdo con alguna parte de los términos,
                        no podrá acceder al Servicio.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">2. Descripción del Servicio</h2>
                    <p>
                        Tincadia es una plataforma de comunicación social que permite a los usuarios enviar mensajes, compartir contenido multimedia
                        y conectar con otras personas. Nos reservamos el derecho de modificar o interrumpir el Servicio en cualquier momento,
                        con o sin previo aviso.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">3. Cuentas de Usuario</h2>
                    <p>
                        Para utilizar ciertas funciones, debe crear una cuenta. Usted es responsable de:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Mantener la confidencialidad de su contraseña.</li>
                        <li>Todas las actividades que ocurran bajo su cuenta.</li>
                        <li>Proporcionar información precisa y completa.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">4. Conducta del Usuario</h2>
                    <p>
                        Usted acepta no utilizar el Servicio para:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Publicar contenido ilegal, ofensivo o que incite al odio.</li>
                        <li>Acosar, intimidar o hacerse pasar por otros usuarios.</li>
                        <li>Enviar spam o comunicaciones no solicitadas.</li>
                        <li>Distribuir malware o intentar acceder sin autorización a nuestros sistemas.</li>
                    </ul>
                    <p>
                        Nos reservamos el derecho de suspender o eliminar cuentas que violen estas normas.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">5. Propiedad Intelectual</h2>
                    <p>
                        El Servicio y su contenido original, características y funcionalidad son propiedad exclusiva de Tincadia y sus licenciantes.
                        El contenido generado por los usuarios sigue siendo propiedad de dichos usuarios, pero al publicarlo, otorgan a Tincadia
                        una licencia para mostrarlo y distribuirlo en relación con el Servicio.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">6. Limitación de Responsabilidad</h2>
                    <p>
                        En ningún caso Tincadia, ni sus directores, empleados o afiliados, serán responsables por daños indirectos, incidentales,
                        especiales o consecuentes que surjan del uso o la imposibilidad de uso del Servicio.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">7. Contacto</h2>
                    <p>
                        Si tiene alguna pregunta sobre estos Términos, por favor contáctenos en: soporte@tincadia.com
                    </p>
                </section>
            </div>
        </div>
    );
}
