import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Trade {
  pair: string;
  profit_ratio: number;
  profit_abs: number;
  open_date: string;
  close_date: string | null;
  open_rate: number;
  close_rate: number | null;
  amount: number;
  stake_amount: number;
  trade_duration: number | null;
  is_open: boolean;
}

interface Strategy {
  name: string;
  path: string;
}

const Dashboard: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [status, setStatus] = useState<string>('');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');

  const fetchData = async () => {
    try {
      const [tradesRes, strategiesRes, statusRes] = await Promise.all([
        axios.get('http://localhost:8000/trades'),
        axios.get('http://localhost:8000/strategies'),
        axios.get('http://localhost:8000/status'),
      ]);

      setTrades(tradesRes.data);
      setStrategies(strategiesRes.data);
      setStatus(statusRes.data.status);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // هر 30 ثانیه به‌روزرسانی
    return () => clearInterval(interval);
  }, []);

  const handleStartTrading = async () => {
    if (!selectedStrategy) return;
    try {
      await axios.post('http://localhost:8000/start', {
        name: selectedStrategy,
        config: {},
      });
      fetchData();
    } catch (error) {
      console.error('Error starting trading:', error);
    }
  };

  const handleStopTrading = async () => {
    try {
      await axios.post('http://localhost:8000/stop');
      fetchData();
    } catch (error) {
      console.error('Error stopping trading:', error);
    }
  };

  const profitData = {
    labels: trades.map(trade => new Date(trade.open_date).toLocaleDateString()),
    datasets: [
      {
        label: 'سود/ضرر',
        data: trades.map(trade => trade.profit_abs),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* وضعیت کلی */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              وضعیت سیستم
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">{status}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleStartTrading}
                disabled={!selectedStrategy}
              >
                شروع معاملات
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleStopTrading}
              >
                توقف معاملات
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* نمودار سود/ضرر */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              نمودار سود/ضرر
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line data={profitData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>

        {/* آمار کلی */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              آمار کلی
            </Typography>
            <Typography variant="body1">
              تعداد معاملات: {trades.length}
            </Typography>
            <Typography variant="body1">
              سود کل: {trades.reduce((sum, trade) => sum + trade.profit_abs, 0).toFixed(2)}
            </Typography>
            <Typography variant="body1">
              معاملات باز: {trades.filter(trade => trade.is_open).length}
            </Typography>
          </Paper>
        </Grid>

        {/* جدول معاملات اخیر */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              معاملات اخیر
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>جفت ارز</TableCell>
                    <TableCell>نرخ باز شدن</TableCell>
                    <TableCell>نرخ بسته شدن</TableCell>
                    <TableCell>سود/ضرر</TableCell>
                    <TableCell>تاریخ باز شدن</TableCell>
                    <TableCell>وضعیت</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trades.slice(0, 10).map((trade, index) => (
                    <TableRow key={index}>
                      <TableCell>{trade.pair}</TableCell>
                      <TableCell>{trade.open_rate}</TableCell>
                      <TableCell>{trade.close_rate || '-'}</TableCell>
                      <TableCell
                        sx={{
                          color: trade.profit_abs >= 0 ? 'success.main' : 'error.main',
                        }}
                      >
                        {trade.profit_abs.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {new Date(trade.open_date).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {trade.is_open ? 'باز' : 'بسته'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 