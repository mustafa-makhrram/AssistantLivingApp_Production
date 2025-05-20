import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SensorTestingVisualizations = () => {
  // Success Rate Comparison Chart Data
  const successRateData = [
    { sensor: 'PIR Motion', successRate: 100 },
    { sensor: 'Pressure', successRate: 100 },
    { sensor: 'MPU-6050', successRate: 100 },
    { sensor: 'Ultrasonic', successRate: 97.6 },
    { sensor: 'Capacitive', successRate: 100 },
    { sensor: 'Overall', successRate: 99.5 }
  ];

  // Latency Comparison Chart Data
  const latencyData = [
    { sensor: 'PIR Motion', avgLatency: 675, minLatency: 0, maxLatency: 4000 },
    { sensor: 'Pressure', avgLatency: 700, minLatency: 0, maxLatency: 1000 },
    { sensor: 'MPU-6050', avgLatency: 756, minLatency: 0, maxLatency: 3000 },
    { sensor: 'Ultrasonic', avgLatency: 650, minLatency: 0, maxLatency: 1000 },
    { sensor: 'Capacitive', avgLatency: 300, minLatency: 0, maxLatency: 1000 },
    { sensor: 'System Avg', avgLatency: 616, minLatency: 0, maxLatency: 4000 }
  ];

  // Event Type Distribution - PIR Motion Sensor
  const motionEventData = [
    { name: 'Entry Events', value: 20 },
    { name: 'Exit Events', value: 20 }
  ];

  // Event Type Distribution - Pressure Sensor
  const pressureEventData = [
    { name: 'Occupied', value: 20 },
    { name: 'Vacant', value: 20 }
  ];

  // Event Type Distribution - MPU-6050 Sensor
  const mpuEventData = [
    { name: 'Movement Start', value: 10 },
    { name: 'Movement Stop', value: 8 },
    { name: 'Significant Movement', value: 20 },
    { name: 'Unusual Movement', value: 3 }
  ];

  // Event Type Distribution - Ultrasonic Sensor
  const ultrasonicEventData = [
    { name: 'Approach', value: 15 },
    { name: 'Retreat', value: 15 },
    { name: 'Closer', value: 5 },
    { name: 'Farther', value: 6 }
  ];

  // Event Type Distribution - Capacitive Sensor
  const capacitiveEventData = [
    { name: 'Medication Taken', value: 15 },
    { name: 'Missed Dose', value: 25 }
  ];

  // Color schemes
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];
  const COLORS_ALT = ['#5DA5DA', '#FAA43A', '#60BD68', '#F17CB0', '#B2912F'];

  // Custom label renderer for capacitive sensor only
  const renderCapacitiveLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="#000000" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-8 text-center">Sensor Performance Analysis</h2>
      
      {/* Figure 1: Success Rate Comparison */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4">Figure 5.2.1: Sensor Success Rate Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={successRateData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sensor" />
            <YAxis domain={[95, 100]} label={{ value: 'Success Rate (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="successRate" name="Success Rate (%)" fill="#0088FE" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm mt-2 text-center">Figure 5.2.1: Success rate comparison across different sensors showing high reliability</p>
      </div>
      
      {/* Figure 2: Latency Comparison */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4">Figure 5.3.1: Latency Comparison Across Sensors</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={latencyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sensor" />
            <YAxis label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="avgLatency" name="Average Latency (ms)" fill="#00C49F" />
            <Bar dataKey="maxLatency" name="Maximum Latency (ms)" fill="#FF8042" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm mt-2 text-center">Figure 5.3.1: Average and maximum latency comparison across different sensors</p>
      </div>
      
      {/* Figure 3: Event Type Distribution - All Sensors */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4">Figure 5.3: Event Type Distribution by Sensor</h3>
        <div className="grid grid-cols-3 gap-4">
          {/* PIR Motion Sensor Events */}
          <div>
            <h4 className="text-lg font-medium mb-2">PIR Motion Sensor</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={motionEventData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {motionEventData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Pressure Sensor Events */}
          <div>
            <h4 className="text-lg font-medium mb-2">Pressure Sensor</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pressureEventData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pressureEventData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_ALT[index % COLORS_ALT.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* MPU-6050 Sensor Events */}
          <div>
            <h4 className="text-lg font-medium mb-2">MPU-6050 Sensor</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={mpuEventData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mpuEventData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Ultrasonic Sensor Events */}
          <div>
            <h4 className="text-lg font-medium mb-2">Ultrasonic Sensor</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={ultrasonicEventData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ultrasonicEventData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_ALT[index % COLORS_ALT.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Medication Events with Capacitive Sensor */}
          <div>
            <h4 className="text-lg font-medium mb-2">Capacitive Sensor</h4>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Pie
                  data={capacitiveEventData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={renderCapacitiveLabel}
                  outerRadius={65}
                  innerRadius={30}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {capacitiveEventData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} events (${(value / 40 * 100).toFixed(0)}%)`, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 text-sm flex justify-center space-x-4">
              {capacitiveEventData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center">
                  <div 
                    className="w-3 h-3 mr-1" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span>{entry.name}: {entry.value} ({(entry.value / 40 * 100).toFixed(0)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm mt-4 text-center">Figure 5.3: Distribution of different event types detected by each sensor during testing</p>
      </div>
      
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4">Table 5.2.13: Sensor Performance Metrics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Sensor Type</th>
                <th className="py-2 px-4 border-b text-left">Success Rate (%)</th>
                <th className="py-2 px-4 border-b text-left">Events Detected</th>
                <th className="py-2 px-4 border-b text-left">Total Events</th>
                <th className="py-2 px-4 border-b text-left">Avg. Latency (ms)</th>
                <th className="py-2 px-4 border-b text-left">Max Latency (ms)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">PIR Motion</td>
                <td className="py-2 px-4 border-b">100.0</td>
                <td className="py-2 px-4 border-b">40</td>
                <td className="py-2 px-4 border-b">40</td>
                <td className="py-2 px-4 border-b">675</td>
                <td className="py-2 px-4 border-b">4000</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Pressure</td>
                <td className="py-2 px-4 border-b">100.0</td>
                <td className="py-2 px-4 border-b">40</td>
                <td className="py-2 px-4 border-b">40</td>
                <td className="py-2 px-4 border-b">700</td>
                <td className="py-2 px-4 border-b">1000</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">MPU-6050</td>
                <td className="py-2 px-4 border-b">100.0</td>
                <td className="py-2 px-4 border-b">41</td>
                <td className="py-2 px-4 border-b">41</td>
                <td className="py-2 px-4 border-b">756</td>
                <td className="py-2 px-4 border-b">3000</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Ultrasonic</td>
                <td className="py-2 px-4 border-b">97.6</td>
                <td className="py-2 px-4 border-b">40</td>
                <td className="py-2 px-4 border-b">41</td>
                <td className="py-2 px-4 border-b">650</td>
                <td className="py-2 px-4 border-b">1000</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Capacitive</td>
                <td className="py-2 px-4 border-b">100.0</td>
                <td className="py-2 px-4 border-b">40</td>
                <td className="py-2 px-4 border-b">40</td>
                <td className="py-2 px-4 border-b">300</td>
                <td className="py-2 px-4 border-b">1000</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 px-4 border-b font-semibold">Overall System</td>
                <td className="py-2 px-4 border-b font-semibold">99.5</td>
                <td className="py-2 px-4 border-b font-semibold">201</td>
                <td className="py-2 px-4 border-b font-semibold">202</td>
                <td className="py-2 px-4 border-b font-semibold">616</td>
                <td className="py-2 px-4 border-b font-semibold">4000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm mt-2 text-center">Table 5.2.13: Comprehensive performance metrics for all sensors in the system</p>
      </div>
    </div>
  );
};

export default SensorTestingVisualizations;