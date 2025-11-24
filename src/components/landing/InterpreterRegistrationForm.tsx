'use client';

import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';

interface InterpreterFormData {
  // Información básica
  nombreCompleto: string;
  documentoIdentidad: string;
  ciudadResidencia: string;
  telefonoWhatsapp: string;
  correoElectronico: string;
  
  // Certificación y educación
  esInterpreteCertificado: 'si' | 'no' | '';
  nivelAcademico: string;
  nivelAcademicoDetalle: string;
  
  // Experiencia
  nivelExperiencia: string;
  areasEspecialidad: string[];
  
  // Servicios
  disponibilidadHoraria: string[];
  tipoServicio: string[];
  
  // Tarifas y documentos
  tarifasPorHora: string;
  hojaVida: File | null;
  certificaciones: File | null;
  redesSocialesPortafolio: string;
  
  // Autorización
  autorizaInclusion: 'si' | 'no' | '';
}

const nivelesAcademicos = [
  'Bachiller académico',
  'Profesional (indique título recibido)',
  'Posgrado (indique título recibido)',
  'Certificado por FENASCOL (indique nivel)',
  'Estudiante de pregrado (indique carrera)',
  'Técnico (indique título)',
  'Tecnólogo (indique título)',
];

const nivelesExperiencia = [
  'Principiante (0–1 año)',
  'Intermedio (1–3 años)',
  'Avanzado (3–5 años)',
  'Profesional (+5 años)',
];

const areasEspecialidad = [
  'Educación',
  'Medicina',
  'Jurídico',
  'Emprendimiento / negocios',
  'Comunidad sorda',
  'Tecnología',
  'Eventos',
  'Otro',
];

const disponibilidadesHorarias = [
  'Mañana',
  'Tarde',
  'Noche',
  'Fines de semana',
  '24/7',
];

const tiposServicio = [
  'Interpretación presencial',
  'Interpretación virtual',
  'Traducción de videos',
  'Tutorías de LSC',
  'Otros',
];

export function InterpreterRegistrationForm() {
  const [formData, setFormData] = useState<InterpreterFormData>({
    nombreCompleto: '',
    documentoIdentidad: '',
    ciudadResidencia: '',
    telefonoWhatsapp: '',
    correoElectronico: '',
    esInterpreteCertificado: '',
    nivelAcademico: '',
    nivelAcademicoDetalle: '',
    nivelExperiencia: '',
    areasEspecialidad: [],
    disponibilidadHoraria: [],
    tipoServicio: [],
    tarifasPorHora: '',
    hojaVida: null,
    certificaciones: null,
    redesSocialesPortafolio: '',
    autorizaInclusion: '',
  });

  const [otraAreaEspecialidad, setOtraAreaEspecialidad] = useState('');
  const [otroTipoServicio, setOtroTipoServicio] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: keyof InterpreterFormData, value: string) => {
    setFormData((prev) => {
      const currentArray = (prev[name] as string[]) || [];
      if (currentArray.includes(value)) {
        return { ...prev, [name]: currentArray.filter((item) => item !== value) };
      }
      return { ...prev, [name]: [...currentArray, value] };
    });
  };

  const handleFileChange = (name: 'hojaVida' | 'certificaciones', file: File | null) => {
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulario enviado:', formData);
    // Aquí iría la lógica para enviar a la API
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
      <div className="mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
          Formulario — Registro de Intérpretes de Lengua de Señas
        </h2>
        <p className="text-gray-600">
          Completa todos los campos para formar parte de nuestra red de intérpretes profesionales.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Nombre completo */}
        <div>
          <label htmlFor="nombreCompleto" className="block text-sm font-semibold text-gray-700 mb-2">
            1. Nombre completo <span className="text-red-500">*</span>
          </label>
          <input
            id="nombreCompleto"
            name="nombreCompleto"
            type="text"
            value={formData.nombreCompleto}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
            required
          />
        </div>

        {/* 2. Documento de identidad */}
        <div>
          <label htmlFor="documentoIdentidad" className="block text-sm font-semibold text-gray-700 mb-2">
            2. Documento de identidad <span className="text-red-500">*</span>
          </label>
          <input
            id="documentoIdentidad"
            name="documentoIdentidad"
            type="text"
            value={formData.documentoIdentidad}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
            required
          />
        </div>

        {/* 3. Ciudad de residencia */}
        <div>
          <label htmlFor="ciudadResidencia" className="block text-sm font-semibold text-gray-700 mb-2">
            3. Ciudad de residencia <span className="text-red-500">*</span>
          </label>
          <input
            id="ciudadResidencia"
            name="ciudadResidencia"
            type="text"
            value={formData.ciudadResidencia}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
            required
          />
        </div>

        {/* 4. Teléfono / WhatsApp */}
        <div>
          <label htmlFor="telefonoWhatsapp" className="block text-sm font-semibold text-gray-700 mb-2">
            4. Teléfono / WhatsApp <span className="text-red-500">*</span>
          </label>
          <input
            id="telefonoWhatsapp"
            name="telefonoWhatsapp"
            type="tel"
            value={formData.telefonoWhatsapp}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
            required
          />
        </div>

        {/* 5. Correo electrónico */}
        <div>
          <label htmlFor="correoElectronico" className="block text-sm font-semibold text-gray-700 mb-2">
            5. Correo electrónico <span className="text-red-500">*</span>
          </label>
          <input
            id="correoElectronico"
            name="correoElectronico"
            type="email"
            value={formData.correoElectronico}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
            required
          />
        </div>

        {/* 6. ¿Eres intérprete certificado? */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            6. ¿Eres intérprete certificado? <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="esInterpreteCertificado"
                value="si"
                checked={formData.esInterpreteCertificado === 'si'}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A]"
                required
              />
              <span className="text-gray-700">Sí</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="esInterpreteCertificado"
                value="no"
                checked={formData.esInterpreteCertificado === 'no'}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A]"
                required
              />
              <span className="text-gray-700">No</span>
            </label>
          </div>
        </div>

        {/* 7. Nivel académico */}
        <div>
          <label htmlFor="nivelAcademico" className="block text-sm font-semibold text-gray-700 mb-2">
            7. Indique nivel académico alcanzado <span className="text-red-500">*</span>
          </label>
          <select
            id="nivelAcademico"
            name="nivelAcademico"
            value={formData.nivelAcademico}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
            required
          >
            <option value="">Seleccione una opción</option>
            {nivelesAcademicos.map((nivel) => (
              <option key={nivel} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
          {(formData.nivelAcademico.includes('indique') ||
            formData.nivelAcademico.includes('indique nivel') ||
            formData.nivelAcademico.includes('indique carrera')) && (
            <input
              type="text"
              name="nivelAcademicoDetalle"
              value={formData.nivelAcademicoDetalle}
              onChange={handleInputChange}
              placeholder="Especifique el título, nivel o carrera"
              className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
              required
            />
          )}
        </div>

        {/* 8. Nivel de experiencia */}
        <div>
          <label htmlFor="nivelExperiencia" className="block text-sm font-semibold text-gray-700 mb-2">
            8. Nivel de experiencia <span className="text-red-500">*</span>
          </label>
          <select
            id="nivelExperiencia"
            name="nivelExperiencia"
            value={formData.nivelExperiencia}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
            required
          >
            <option value="">Seleccione una opción</option>
            {nivelesExperiencia.map((nivel) => (
              <option key={nivel} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
        </div>

        {/* 9. Áreas de especialidad */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            9. Áreas de especialidad (selección múltiple) <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {areasEspecialidad.map((area) => (
              <label key={area} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.areasEspecialidad.includes(area)}
                  onChange={() => handleCheckboxChange('areasEspecialidad', area)}
                  className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A] rounded"
                />
                <span className="text-gray-700">{area}</span>
              </label>
            ))}
          </div>
          {formData.areasEspecialidad.includes('Otro') && (
            <input
              type="text"
              value={otraAreaEspecialidad}
              onChange={(e) => setOtraAreaEspecialidad(e.target.value)}
              placeholder="Especifique otra área"
              className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
            />
          )}
        </div>

        {/* 10. Disponibilidad horaria */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            10. Disponibilidad horaria <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {disponibilidadesHorarias.map((disponibilidad) => (
              <label key={disponibilidad} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.disponibilidadHoraria.includes(disponibilidad)}
                  onChange={() => handleCheckboxChange('disponibilidadHoraria', disponibilidad)}
                  className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A] rounded"
                />
                <span className="text-gray-700">{disponibilidad}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 11. Tipo de servicio */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            11. Tipo de servicio que ofrece (selección múltiple) <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {tiposServicio.map((tipo) => (
              <label key={tipo} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.tipoServicio.includes(tipo)}
                  onChange={() => handleCheckboxChange('tipoServicio', tipo)}
                  className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A] rounded"
                />
                <span className="text-gray-700">{tipo}</span>
              </label>
            ))}
          </div>
          {formData.tipoServicio.includes('Otros') && (
            <input
              type="text"
              value={otroTipoServicio}
              onChange={(e) => setOtroTipoServicio(e.target.value)}
              placeholder="Especifique otro tipo de servicio"
              className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
            />
          )}
        </div>

        {/* 12. Tarifas por hora */}
        <div>
          <label htmlFor="tarifasPorHora" className="block text-sm font-semibold text-gray-700 mb-2">
            12. Tarifas por hora <span className="text-red-500">*</span>
          </label>
          <input
            id="tarifasPorHora"
            name="tarifasPorHora"
            type="text"
            value={formData.tarifasPorHora}
            onChange={handleInputChange}
            placeholder="Ej: $50.000 COP"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
            required
          />
        </div>

        {/* 13. Hoja de vida (PDF) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            13. Hoja de vida (PDF) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange('hojaVida', e.target.files?.[0] || null)}
              className="hidden"
              id="hojaVida"
              required
            />
            <label
              htmlFor="hojaVida"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#83A98A] cursor-pointer transition-all group"
            >
              <FileText className="w-5 h-5 text-gray-400 group-hover:text-[#83A98A]" />
              <span className="text-sm text-gray-600 group-hover:text-[#83A98A]">
                {formData.hojaVida ? formData.hojaVida.name : 'Seleccionar archivo PDF'}
              </span>
            </label>
          </div>
        </div>

        {/* 14. Certificaciones (opcional) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            14. Certificaciones (opcional)
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange('certificaciones', e.target.files?.[0] || null)}
              className="hidden"
              id="certificaciones"
            />
            <label
              htmlFor="certificaciones"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#83A98A] cursor-pointer transition-all group"
            >
              <Upload className="w-5 h-5 text-gray-400 group-hover:text-[#83A98A]" />
              <span className="text-sm text-gray-600 group-hover:text-[#83A98A]">
                {formData.certificaciones
                  ? formData.certificaciones.name
                  : 'Seleccionar archivo (PDF, JPG, PNG)'}
              </span>
            </label>
          </div>
        </div>

        {/* 15. Redes sociales o portafolio */}
        <div>
          <label htmlFor="redesSocialesPortafolio" className="block text-sm font-semibold text-gray-700 mb-2">
            15. Redes sociales o portafolio
          </label>
          <input
            id="redesSocialesPortafolio"
            name="redesSocialesPortafolio"
            type="url"
            value={formData.redesSocialesPortafolio}
            onChange={handleInputChange}
            placeholder="https://..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
          />
        </div>

        {/* 16. Autorización */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            16. Autorizo a TINCADIA a incluirme en la base de datos y contactarme laboralmente{' '}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="autorizaInclusion"
                value="si"
                checked={formData.autorizaInclusion === 'si'}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A]"
                required
              />
              <span className="text-gray-700">Sí</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="autorizaInclusion"
                value="no"
                checked={formData.autorizaInclusion === 'no'}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A]"
                required
              />
              <span className="text-gray-700">No</span>
            </label>
          </div>
        </div>

        {/* Botón Submit */}
        <button
          type="submit"
          className="w-full bg-[#83A98A] text-white font-semibold py-3.5 px-6 rounded-lg hover:bg-[#6D8F75] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] transition-all duration-300 shadow-lg hover:shadow-xl mt-8"
        >
          Enviar Formulario
        </button>
      </form>
    </div>
  );
}

