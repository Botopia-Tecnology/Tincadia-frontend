import { FileText, MessageSquare } from 'lucide-react';

export const formTypeIcons: Record<string, any> = {
    ser_interprete: MessageSquare,
    job_seeker_registration: FileText,
    interpreter_registration: MessageSquare,
    contact: FileText,
    feedback: FileText,
};

export const formTypeLabels: Record<string, string> = {
    ser_interprete: 'Ser Intérprete',
    job_seeker_registration: 'Registro Buscador de Empleo',
    interpreter_registration: 'Registro de Intérprete',
    contact: 'Contacto',
    feedback: 'Feedback',
};

export const fieldLabels: Record<string, string> = {
    nombreCompleto: 'Nombre Completo',
    documentoIdentidad: 'Documento de Identidad',
    tipoDiscapacidad: 'Tipo de Discapacidad',
    usaLSC: 'Usa Lengua de Señas Colombiana',
    ciudadResidencia: 'Ciudad de Residencia',
    telefonoWhatsapp: 'Teléfono / WhatsApp',
    telefono: 'Teléfono',
    correoElectronico: 'Correo Electrónico',
    nivelEducativo: 'Nivel Educativo',
    nivelAcademico: 'Nivel Académico',
    nivelAcademicoDetalle: 'Detalle Nivel Académico',
    nivelExperiencia: 'Nivel de Experiencia',
    areaLaboralInteres: 'Áreas Laborales de Interés',
    areasEspecialidad: 'Áreas de Especialidad',
    experienciaLaboral: 'Experiencia Laboral',
    habilidadesTecnicas: 'Habilidades Técnicas',
    habilidadesBlandas: 'Habilidades Blandas',
    certificacionesCursos: 'Certificaciones y Cursos',
    certificaciones: 'Certificaciones',
    tipoServicio: 'Tipo de Servicio',
    disponibilidadHoraria: 'Disponibilidad Horaria',
    esInterpreteCertificado: 'Es Intérprete Certificado',
    redesSocialesPortafolio: 'Redes Sociales / Portafolio',
    hojaVida: 'Hoja de Vida / CV',
    recibirCapacitacion: 'Desea Recibir Capacitación',
    autorizaTratamientoDatos: 'Autoriza Tratamiento de Datos',
    autorizaInclusion: 'Autoriza Inclusión',
    mensaje: 'Mensaje',
};

export const fieldCategories: Record<string, string[]> = {
    'Información Personal': [
        'nombreCompleto',
        'documentoIdentidad',
        'tipoDiscapacidad',
        'usaLSC',
        'ciudadResidencia',
        'esInterpreteCertificado',
    ],
    'Información de Contacto': [
        'correoElectronico',
        'telefonoWhatsapp',
        'telefono',
        'redesSocialesPortafolio',
    ],
    'Información Educativa y Profesional': [
        'nivelEducativo',
        'nivelAcademico',
        'nivelAcademicoDetalle',
        'nivelExperiencia',
        'areaLaboralInteres',
        'areasEspecialidad',
        'experienciaLaboral',
        'habilidadesTecnicas',
        'habilidadesBlandas',
        'certificacionesCursos',
        'tipoServicio',
        'disponibilidadHoraria',
    ],
    'Documentos': [
        'hojaVida',
        'certificaciones',
    ],
    'Preferencias y Autorizaciones': [
        'recibirCapacitacion',
        'autorizaTratamientoDatos',
        'autorizaInclusion',
    ],
    'Mensaje': [
        'mensaje',
    ],
};

