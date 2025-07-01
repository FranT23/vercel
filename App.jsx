
// App.jsx (contenido exportado del canvas)
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, ReferenceDot, ReferenceLine } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';

// Base de datos de curvas
const baseDemanda = [
  { precio: 10, cantidad: 90 },
  { precio: 20, cantidad: 70 },
  { precio: 30, cantidad: 50 },
  { precio: 40, cantidad: 30 },
  { precio: 50, cantidad: 10 },
];

const baseOferta = [
  { precio: 10, cantidad: 10 },
  { precio: 20, cantidad: 30 },
  { precio: 30, cantidad: 50 },
  { precio: 40, cantidad: 70 },
  { precio: 50, cantidad: 90 },
];

export default function GraficasMercado() {
  const [ingreso, setIngreso] = useState(1);
  const [costo, setCosto] = useState(1);

  const demandaAjustada = baseDemanda.map(p => ({ ...p, cantidad: Math.round(p.cantidad * ingreso) }));
  const ofertaAjustada = baseOferta.map(p => ({ ...p, cantidad: Math.round(p.cantidad / costo) }));

  const calcularEquilibrio = () => {
    for (let i = 0; i < demandaAjustada.length; i++) {
      if (Math.abs(demandaAjustada[i].cantidad - ofertaAjustada[i].cantidad) <= 5) {
        return {
          precio: demandaAjustada[i].precio,
          cantidad: (demandaAjustada[i].cantidad + ofertaAjustada[i].cantidad) / 2,
        };
      }
    }
    return null;
  };

  const equilibrio = calcularEquilibrio();

  const sabiasQue = [
    "¿Sabías que...? En mercados inelásticos, el precio puede subir mucho sin que la cantidad demandada cambie demasiado (como con la insulina)?",
    "¿Sabías que...? En competencia perfecta, ningún vendedor puede influir solo en el precio: todos venden al mismo precio de equilibrio.",
    "¿Sabías que...? Las curvas se desplazan si cambian factores distintos al precio, como el ingreso o el clima (en productos agrícolas)?",
    "¿Sabías que...? El equilibrio del mercado representa un punto ideal, pero en la vida real puede variar por shocks externos como guerras o pandemias?",
    "¿Sabías que...? Un exceso de oferta ocurre cuando el precio es mayor al equilibrio y los productores no logran vender todo lo que producen?"
  ];

  const randomFact = sabiasQue[Math.floor(Math.random() * sabiasQue.length)];

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Simulación Interactiva del Mercado</h1>
      <p className="text-base leading-relaxed">
        Usa los controles para ver cómo cambian las curvas de oferta y demanda con ejemplos reales:
        <br />
        - Aumentá el ingreso para ver cómo crece la demanda (por ejemplo, con una mejora económica).
        <br />
        - Aumentá los costos para ver cómo se reduce la oferta (por ejemplo, si sube el precio de los fertilizantes).
      </p>

      <div className="bg-blue-50 p-4 rounded-md border border-blue-200 shadow">
        <h2 className="text-lg font-semibold text-blue-700 mb-1">💡 ¿Sabías que...?</h2>
        <p className="text-blue-800 text-sm">{randomFact}</p>
      </div>

      <Tabs defaultValue="desplazamientos" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="desplazamientos">Gráfica con controles</TabsTrigger>
        </TabsList>

        <TabsContent value="desplazamientos">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block font-semibold mb-1">Ingreso del consumidor (Ej: suba de sueldos)</label>
              <Slider min={0.5} max={2} step={0.1} value={[ingreso]} onValueChange={([v]) => setIngreso(v)} />
              <p className="text-sm mt-1">Valor actual: x{ingreso.toFixed(1)}</p>
            </div>
            <div>
              <label className="block font-semibold mb-1">Costo de producción (Ej: suba de insumos)</label>
              <Slider min={0.5} max={2} step={0.1} value={[costo]} onValueChange={([v]) => setCosto(v)} />
              <p className="text-sm mt-1">Valor actual: x{costo.toFixed(1)}</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cantidad" type="number" domain={[0, 150]}>
                <Label value="Cantidad ofrecida / demandada" offset={-5} position="insideBottom" />
              </XAxis>
              <YAxis domain={[0, 60]}>
                <Label value="Precio" angle={-90} position="insideLeft" />
              </YAxis>
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />

              {equilibrio && (
                <>
                  <ReferenceDot
                    x={equilibrio.cantidad}
                    y={equilibrio.precio}
                    r={6}
                    fill="#000"
                    label={{ value: `Equilibrio
($${equilibrio.precio}, ${Math.round(equilibrio.cantidad)} u)`, position: 'top' }}
                  />
                  <ReferenceLine y={equilibrio.precio} stroke="#aaa" strokeDasharray="3 3" />
                  <ReferenceLine x={equilibrio.cantidad} stroke="#aaa" strokeDasharray="3 3" />
                </>
              )}

              <Line type="monotone" strokeDasharray="5 5" data={baseDemanda} dataKey="precio" stroke="#8884d8" name="Demanda Original" dot animationDuration={1000} />
              <Line type="monotone" strokeDasharray="3 3" data={demandaAjustada} dataKey="precio" stroke="#ff69b4" name="Demanda Ajustada" dot animationDuration={1000} />
              <Line type="monotone" strokeDasharray="5 5" data={baseOferta} dataKey="precio" stroke="#82ca9d" name="Oferta Original" dot animationDuration={1000} />
              <Line type="monotone" strokeDasharray="3 3" data={ofertaAjustada} dataKey="precio" stroke="#ff6347" name="Oferta Ajustada" dot animationDuration={1000} />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4 text-sm text-gray-700">
            <p>
              <strong>Ejemplo práctico:</strong> Si el ingreso de los consumidores aumenta, la curva de demanda se desplaza hacia la derecha
              (más personas pueden comprar). Si al mismo tiempo los costos suben, la curva de oferta se desplaza a la izquierda (los productores ofrecen menos).
            </p>
            <p className="mt-2">
              El <strong>punto de equilibrio</strong> es donde se cruzan ambas curvas ajustadas: indica el precio y la cantidad donde el mercado se equilibra. Se actualiza automáticamente.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
