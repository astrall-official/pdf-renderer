import type { NextApiRequest, NextApiResponse } from "next";
import { renderToFile } from "@react-pdf/renderer";
import path from "path";
import fs from "fs-extra";
import MyDocument from "../../components/MyDocument";
import { DocumentData, ExportPdfRequest } from "../../types";
import React from "react";
import { GcpStorageService } from "../../services/gcp-storage";
import MarkdownReportPDF from "../../components/PDFDocument/MarkdownReportPDF";

type ResponseData = {
  message: string;
  filePath?: string;
  error?: string;
};

let markdown: string = `
# Introducción
La astrología ofrece una perspectiva única para comprendernos a nosotros mismos y nuestros caminos de vida. Al examinar las posiciones planetarias en el momento de tu nacimiento y sus movimientos actuales, podemos descubrir aspectos importantes sobre tu personalidad, fortalezas, desafíos y las energías que influyen en tu vida en este momento. Este reporte busca proporcionarte una comprensión más profunda de tu configuración astrológica y cómo se relaciona con las preguntas que has planteado, **empoderándote** para tomar decisiones informadas y abrazar tu proceso de crecimiento personal.

Sin embargo, es importante abordar las interpretaciones astrológicas desde una perspectiva equilibrada. Si bien la astrología puede iluminar patrones y potencialidades, no determina tu destino. Tienes libre albedrío para dar forma a tu vida mediante tus elecciones y acciones. Usa este reporte como una herramienta para la *autorreflexión y guía*, pero recuerda que tú eres en última instancia responsable de tu propio bienestar y desarrollo. Aborda estas perspectivas con una mente abierta y considera cómo resuenan con tus propias experiencias e intuiciones.

> "Los astros inclinan, pero no obligan." — Máxima astrológica antigua
# Encontrando el Amor Verdadero

> "Ximena, ¿cómo puedes alinear tus energías y experiencias pasadas para atraer una relación amorosa estable y significativa en tu vida?"

## Análisis Astrológico

Tu carta natal muestra un Sol en Piscis en la casa 9, lo que sugiere una naturaleza soñadora y una búsqueda de significado en tus experiencias. Venus y Marte en Aries en la casa 11 indican una energía apasionada y un deseo de conexión social. La Luna en Leo en la casa 2 revela una necesidad de ser vista y valorada en tus relaciones. Este emplazamiento puede generar inseguridades emocionales que, como mencionaste, han afectado tus relaciones pasadas.

Los tránsitos de los próximos 30 días muestran a Venus transitando por Géminis, activando tu Ascendente en este signo. Este tránsito puede traer oportunidades para conectar con otros de manera más ligera y comunicativa. Júpiter en Tauro podría formar aspectos favorables con tus planetas en Aries, impulsando tu confianza y atrayendo nuevas relaciones. Sin embargo, es crucial mantener la autenticidad y evitar caer en patrones impulsivos.

La presencia de Plutón en la casa 5 sugiere una profunda transformación en tu enfoque del amor y la creatividad. ¿Qué miedos o deseos reprimidos podrían estar influyendo en tu capacidad para formar relaciones duraderas? Reflexionar sobre estas preguntas puede ayudarte a liberarte de patrones limitantes y a abrirte a nuevas posibilidades amorosas.

Considerando tu edad y experiencias pasadas, es importante reconocer que encontrar una pareja estable puede llevar tiempo y esfuerzo. No te desanimes por los desafíos y enfócate en construir una base sólida de autoconfianza y amor propio. Explora tus intereses y pasiones, y busca actividades que te permitan conocer gente nueva de manera natural.

Basándonos en tu carta natal y los tránsitos, es posible que encuentres una relación amorosa estable si trabajas en tu autoconfianza y te abres a nuevas experiencias. Utiliza este tiempo para sanar heridas pasadas y cultivar una relación saludable contigo misma. Recuerda que el amor verdadero comienza desde adentro.

## Desafiando Creencias Limitantes
- ¿Cómo puedes transformar tus inseguridades en fortalezas que te permitan atraer una relación amorosa auténtica?
- ¿Qué pasos puedes dar para romper patrones impulsivos y construir relaciones más estables y significativas?
- ¿De qué manera puedes honrar tu necesidad de ser vista y valorada sin comprometer tu autenticidad?

## Recomendaciones
- Practica la auto-compasión y el mindfulness para reducir la impulsividad y aumentar la conciencia de tus emociones en las relaciones.
- Participa en actividades sociales que te apasionen para conocer gente nueva y construir conexiones auténticas.
- Visualiza una relación amorosa saludable y establece límites claros para proteger tu bienestar emocional.

# Explorando la Maternidad

> "Ximena, ¿cómo puedes alinear tus deseos y energías para explorar la posibilidad de ser madre, ya sea biológicamente o a través de otras vías?"

## Análisis Astrológico

Tu carta natal muestra a Plutón en la casa 5, lo que indica una profunda transformación en tu enfoque de la creatividad y la expresión personal, incluyendo la maternidad. La Luna en Leo en la casa 2 sugiere una fuerte necesidad de nutrir y cuidar, pero también puede indicar inseguridades sobre tu capacidad para ser madre. Júpiter en Acuario en la casa 8 podría señalar oportunidades para explorar opciones no convencionales de maternidad.

Los tránsitos de los próximos 30 días muestran a Saturno en Piscis, transitando tu casa 9, lo que puede traer una sensación de responsabilidad y madurez en tus decisiones sobre la maternidad. Urano en Tauro podría activar tu casa 12, impulsándote a explorar tus deseos más profundos y a liberarte de expectativas sociales. Este tránsito puede generar oportunidades para conectar con otros de manera más ligera y comunicativa.

La presencia de Saturno en la casa 6 sugiere una profunda transformación en tu enfoque del amor y la creatividad. ¿Qué miedos o deseos reprimidos podrían estar influyendo en tu capacidad para formar relaciones duraderas? Reflexionar sobre estas preguntas puede ayudarte a liberarte de patrones limitantes y a abrirte a nuevas posibilidades amorosas.

Considerando tu edad y situación actual, es importante ser realista sobre las opciones disponibles para la maternidad. Explora todas las posibilidades, desde la concepción natural hasta la adopción o la maternidad subrogada. Habla con profesionales de la salud y busca el apoyo de amigos y familiares para tomar una decisión informada y consciente.

Basándonos en tu carta natal y los tránsitos, es posible que tengas la oportunidad de ser madre si exploras tus opciones y te abres a diferentes caminos. Utiliza este tiempo para reflexionar sobre tus deseos y valores, y para tomar decisiones que estén alineadas con tu bienestar emocional y espiritual. Recuerda que la maternidad puede manifestarse de muchas formas diferentes.

## Abrazando la Fertilidad Interior
- ¿Cómo puedes honrar tu necesidad de nutrir y cuidar, independientemente de si tienes hijos biológicos o no?
- ¿Qué pasos puedes dar para explorar tus opciones de maternidad de manera informada y consciente?
- ¿De qué manera puedes liberarte de expectativas sociales y tomar decisiones que estén alineadas con tus valores y deseos más profundos?

## Pasos Prácticos a Seguir
- Investiga las diferentes opciones de maternidad disponibles y habla con profesionales de la salud para obtener información precisa y actualizada.
- Practica la meditación y la visualización para conectar con tu fertilidad interior y explorar tus deseos más profundos sobre la maternidad.
- Busca el apoyo de amigos, familiares o grupos de apoyo para compartir tus experiencias y recibir orientación emocional.

# Encontrando tu Vocación Profesional

> "Ximena, ¿cómo puedes alinear tus talentos y pasiones para encontrar un área en la abogacía que te brinde satisfacción personal y éxito económico, o determinar si un empleo fijo es el camino correcto para ti?"

## Análisis Astrológico

Tu carta natal muestra un Medio Cielo en Piscis, lo que sugiere una vocación que involucra la creatividad, la compasión y el servicio a los demás. Mercurio en Piscis en la casa 10 indica una habilidad para comunicar ideas complejas de manera intuitiva y empática. Júpiter en Acuario en la casa 8 podría señalar oportunidades para trabajar en áreas relacionadas con la justicia social, la transformación personal o la investigación.

Los tránsitos de los próximos 30 días muestran a Marte transitando por Cáncer, activando tu casa 2, lo que puede traer un impulso para generar ingresos y asegurar tu estabilidad financiera. Saturno en Piscis podría formar aspectos desafiantes con tu Medio Cielo, impulsándote a definir metas profesionales realistas y a trabajar con disciplina para alcanzarlas. Este tránsito puede generar oportunidades para conectar con otros de manera más ligera y comunicativa.

La presencia de Neptuno en la casa 7 sugiere una profunda transformación en tu enfoque del amor y la creatividad. ¿Qué miedos o deseos reprimidos podrían estar influyendo en tu capacidad para formar relaciones duraderas? Reflexionar sobre estas preguntas puede ayudarte a liberarte de patrones limitantes y a abrirte a nuevas posibilidades amorosas.

Considerando tu experiencia en derecho y biomagnetismo, podrías explorar áreas que combinen ambas disciplinas, como el derecho de la salud, la mediación en conflictos médicos o la asesoría legal para terapeutas. También podrías considerar un empleo fijo en el poder judicial si valoras la estabilidad y la seguridad económica. Evalúa tus prioridades y elige el camino que mejor se adapte a tus necesidades y valores.

Basándonos en tu carta natal y los tránsitos, es posible que encuentres una vocación profesional satisfactoria si alineas tus talentos y pasiones con tus metas financieras. Utiliza este tiempo para explorar diferentes opciones y para tomar decisiones que estén alineadas con tu bienestar emocional y espiritual. Recuerda que el éxito profesional no se mide solo en términos económicos, sino también en términos de satisfacción personal y contribución a la sociedad.

## Despertando tu Potencial Profesional
- ¿Cómo puedes combinar tus habilidades en derecho y biomagnetismo para crear una carrera única y significativa?
- ¿Qué pasos puedes dar para superar tus miedos y tomar riesgos calculados en tu búsqueda de una vocación profesional satisfactoria?
- ¿De qué manera puedes equilibrar tus necesidades de estabilidad económica con tu deseo de autonomía y creatividad en el trabajo?

## Pasos Prácticos a Seguir
- Investiga áreas de la abogacía que combinen tus intereses en derecho y biomagnetismo, y busca oportunidades para adquirir experiencia en esos campos.
- Establece metas profesionales claras y realistas, y crea un plan de acción para alcanzarlas.
- Busca el apoyo de mentores, coaches o grupos de networking para recibir orientación y motivación en tu camino profesional.
# Sigue avanzando
Este reporte ha sido creado especialmente para ti, iluminando tu camino con la sabiduría de los astros y el poder transformador de tu conciencia. Ahora tienes frente a ti una oportunidad única para actuar con intención, compromiso y confianza. Recuerda que las estrellas sugieren, pero tú eres quien escribe tu historia.

Es momento de que tomes acción y pongas en práctica estos conocimientos para vivir plenamente tu potencial. Abraza cada reto como una oportunidad para crecer, utiliza cada consejo como un paso concreto hacia la vida que deseas y mantente fiel a tu propia luz interior. ¡Tu viaje apenas comienza; adelante con valentía!`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const request: ExportPdfRequest = req.body;
    let documentData: DocumentData;

    // If GCP file info is provided, read the content from GCP Storage
    if (request.gcpFile) {
      const { bucketName, filePath } = request.gcpFile;
      const fileContent = await GcpStorageService.readTextFile(bucketName, filePath);
      
      // Process file content into document data
      // This depends on the expected format of the text file
      try {
        documentData = JSON.parse(fileContent) as DocumentData;
      } catch (error) {
        // If not JSON, create document data with the text content
        documentData = {
          title: "Document Title",
          content: fileContent,
          author: "Author Name",
          // Add other required fields with default values as needed
        } as DocumentData;
      }
    } else if (request.documentData) {
      // Use provided document data if GCP file info is not present
      documentData = request.documentData;
    } else {
      return res.status(400).json({ 
        message: "Bad request", 
        error: "Either documentData or gcpFile must be provided" 
      });
    }

    // Create PDF file
    const outputDir = path.join(process.cwd(), "public", "exports");
    await fs.ensureDir(outputDir);

    const timestamp = new Date().getTime();
    const filename = `document-${timestamp}.pdf`;
    const filePath = path.join(outputDir, filename);

    await renderToFile(
      React.createElement(MarkdownReportPDF, { markdown, theme: 'default' }) as any,
      filePath,
    );

    return res.status(200).json({
      message: "PDF exported successfully",
      filePath: `/exports/${filename}`,
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res.status(500).json({
      message: "Failed to generate PDF",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
