'use client';
import { useEffect, useState } from 'react';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

interface RegistrationData {
  createdAt: string;
  _count: {
    createdAt: number;
  };
}

interface Props {
  eventId: string;
}

const ParticipantsChart = ({ eventId }: Props) => {
  const [registrationData, setRegistrationData] = useState<RegistrationData[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformRegistrationData = (registrationData: RegistrationData[]) => {
    return registrationData.map((item) => ({
      date: new Date(item.createdAt).toLocaleDateString(),
      registrations: item._count.createdAt,
    }));
  };

  const chartConfig = {
    registrations: {
      label: 'Total Registrations',
    },
  } satisfies ChartConfig;

  useEffect(() => {
    const fetchRegistrationData = async () => {
      try {
        const response = await fetch(
          `/api/events/${eventId}/registrations-per-day`
        );
        const data = await response.json();
        setRegistrationData(data);
        console.log(transformRegistrationData(data));
      } catch (err) {
        console.log(err);
        setError('Error fetching registration data');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationData();
  }, [eventId]);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p className='text-red-500'>{error}</p>;

  return (
    <Card>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
          <CardTitle>Bar Chart</CardTitle>
          <CardDescription>Registrations per day</CardDescription>
        </div>
      </CardHeader>
      <CardContent className='px-2 sm:p-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <BarChart
            accessibilityLayer
            data={transformRegistrationData(registrationData)}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className='w-[150px]'
                  nameKey='registrations'
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }}
                />
              }
            />
            <Bar dataKey='registrations' />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ParticipantsChart;
