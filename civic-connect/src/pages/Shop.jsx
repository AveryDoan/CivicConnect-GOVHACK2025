
import React, { useState, useEffect } from "react";
import { ShopItem } from "@/api/entities";
import { User } from "@/api/entities";
import { Transaction } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  ShoppingCart, 
  Coins, 
  Gift, 
  Ticket, 
  CreditCard, 
  Star,
  Check
} from "lucide-react";

const categoryIcons = {
  badge: Star,
  gift_card: Gift,
  event_ticket: Ticket,
  transport: CreditCard,
  experience: Star
};

export default function Shop() {
  const [shopItems, setShopItems] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [itemData, userData] = await Promise.all([
        ShopItem.filter({ is_available: true }, 'coin_cost'),
        User.me()
      ]);
      
      setShopItems(itemData);
      setUser(userData);
    } catch (error) {
      console.error("Error loading shop data:", error);
    }
    setIsLoading(false);
  };

  const purchaseItem = async (item) => {
    if ((user.civic_coins || 0) < item.coin_cost) return;

    try {
      // Create transaction
      await Transaction.create({
        user_email: user.email,
        transaction_type: 'spent',
        amount: -item.coin_cost,
        source: item.id,
        description: `Purchased: ${item.name}`
      });

      // Update user balance
      const newBalance = (user.civic_coins || 0) - item.coin_cost;
      await User.updateMyUserData({ civic_coins: newBalance });

      // Reload data
      loadData();
    } catch (error) {
      console.error("Error purchasing item:", error);
    }
  };

  const filteredItems = selectedTier === "all" 
    ? shopItems 
    : shopItems.filter(item => item.tier === parseInt(selectedTier));

  const canAfford = (cost) => (user?.civic_coins || 0) >= cost;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative rounded-xl overflow-hidden mb-8 p-8 h-64 flex flex-col justify-end" style={{backgroundImage: "url('https://cdn.midjourney.com/a9602bc7-fc3e-427a-8671-2408326f5ee5/0_1.png')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="relative">
          <h1 className="text-4xl font-bold text-white mb-2">Civic Coin Shop</h1>
          <p className="text-white/90 text-lg">
            Redeem your hard-earned coins for amazing rewards.
          </p>
        </div>
      </div>

      {/* Coin Balance */}
      <Card className="mb-8 shadow-lg border-0 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {user?.civic_coins || 0} Civic Coins
                </div>
                <p className="text-yellow-100">Available to spend</p>
              </div>
            </div>
            <ShoppingCart className="w-8 h-8 text-yellow-100" />
          </div>
        </CardContent>
      </Card>

      {/* Tier Tabs */}
      <Tabs value={selectedTier} onValueChange={setSelectedTier} className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="1">Tier 1</TabsTrigger>
          <TabsTrigger value="2">Tier 2</TabsTrigger>
          <TabsTrigger value="3">Tier 3</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Shop Items Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? Array(6).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse h-64 bg-gray-200"></Card>
        )) : filteredItems.map(item => {
          const Icon = categoryIcons[item.category] || Gift;
          const affordable = canAfford(item.coin_cost);
          
          return (
            <Card key={item.id} className={`shadow-lg border-0 bg-white/80 backdrop-blur-sm ${
              !affordable ? 'opacity-60' : ''
            }`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={`
                    ${item.tier === 1 ? 'bg-green-100 text-green-700' : ''}
                    ${item.tier === 2 ? 'bg-blue-100 text-blue-700' : ''}
                    ${item.tier === 3 ? 'bg-purple-100 text-purple-700' : ''}
                  `}>
                    Tier {item.tier}
                  </Badge>
                  <div className="flex items-center gap-1 font-bold text-yellow-600">
                    <Coins className="w-4 h-4" />
                    {item.coin_cost}
                  </div>
                </div>
                
                {/* Item Image */}
                {item.image_url && (
                  <div className="w-full h-32 mb-3 rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${
                    item.tier === 1 ? 'text-green-600' : 
                    item.tier === 2 ? 'text-blue-600' : 'text-purple-600'
                  }`} />
                  {item.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                
                {affordable ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                        Purchase
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to purchase "{item.name}" for {item.coin_cost} Civic Coins?
                          You will have {(user?.civic_coins || 0) - item.coin_cost} coins remaining.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => purchaseItem(item)}>
                          Confirm Purchase
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <Button disabled className="w-full">
                    Insufficient Coins
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredItems.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-medium text-gray-500 mb-2">No items available</h3>
          <p className="text-gray-400">Check back later for new rewards!</p>
        </div>
      )}
    </div>
  );
}
