import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import client from "../api/client";

const OrderListScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await client.get("/orders/?skip=0&limit=50");
      setOrders(response.data);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Reload data when tab is focused
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const renderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderNo}>{item.order_no}</Text>
        <Text style={styles.date}>
          {new Date(item.order_date).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.customerName}>{item.cust_name}</Text>
      <Text style={styles.mobile}>Mob: {item.mobile}</Text>

      <View style={styles.footer}>
        <Text style={styles.totalCost}>Total: ₹{item.total_cost}</Text>
        <Text
          style={[
            styles.balance,
            { color: item.balance > 0 ? "#D32F2F" : "#388E3C" },
          ]}
        >
          Bal: ₹{item.balance}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Recent Orders</Text>
      {loading ? (
        <ActivityIndicator
          size="large"
          style={{ marginTop: 20 }}
          color="#007AFF"
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20, color: "#666" }}>
              No orders found.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#fff",
  },
  list: {
    padding: 15,
  },
  orderCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  orderNo: {
    fontWeight: "bold",
    color: "#007AFF",
  },
  date: {
    color: "#888",
    fontSize: 12,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  mobile: {
    color: "#666",
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  totalCost: {
    fontWeight: "bold",
  },
  balance: {
    fontWeight: "bold",
  },
});

export default OrderListScreen;
