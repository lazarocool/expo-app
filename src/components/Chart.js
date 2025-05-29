import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  decimalPlaces: 0,
};

const Chart = ({ type, data, title }) => {
  const renderChart = () => {
    if (type === 'line') {
      return (
        <LineChart
          data={data}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      );
    } 
    else if (type === 'bar') {
      return (
        <BarChart
          data={data}
          width={screenWidth - 40}
          height={220}
          yAxisLabel="$"
          chartConfig={{
            ...chartConfig,
            barPercentage: 0.7,
            color: (opacity = 1) => `rgba(255, 221, 0, ${opacity})`,
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          showValuesOnTopOfBars
        />
      );
    }
    
    return null;
  };

  return (
    <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
      {title && <Text className="text-lg font-bold mb-2">{title}</Text>}
      {renderChart()}
    </View>
  );
};

export default Chart;
