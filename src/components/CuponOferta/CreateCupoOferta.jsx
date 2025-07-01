import { useState } from "react"
import { CalendarDays, Car, Gift, Percent, Plus, Tag, Trash2 } from "lucide-react"

import { Badge } from '../ui/badge.jsx'
import { Button } from '../ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card.jsx'
import { Input } from '../ui/input.jsx'
import { Label } from "../ui/label.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select.jsx"
import { Switch } from "../ui/switch.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs.jsx"
import { Textarea } from "../ui/textarea.jsx"

export default function CreateCupoOferta(){
    const [coupons, setCoupons] = useState([
        {
            id:"1",
            code: "ALPACA20",
            type: "percentage",
            value: 20,
            minAmount: 100,
            maxDiscount: 50,
            usageLimit: 100,
            usedCount: 23,
            expiresAt: "2024-12-31",
            isActive: true,
            createdAt: "2024-01-15",
        },
        {
            id:"2",
            code: "WELCOME10",
            type: "fixed",
            value: 10,
            usageLimit: 500,
            usedCount: 156,
            expiresAt: "2024-06-30",
            isActive: true,
            createdAt: "2024-01-10",
        },
    ])

    const[offers, setOffers] = useState([
        {
            id: "1",
            name: "Oferta de Invierno",
            description: "Descuento especial en toda la colección de invierno de alpaca",
            discount: 25,
            startDate: "2024-06-01",
            endDate: "2024-08-31",
            category: "Invierno",
            isActive: true,
            createdAt: "2024-05-15",
        },
        {
            id: "2",
            name: "Black Friday Alpaca",
            description: "Descuentos increíbles en productos seleccionados",
            discount: 40,
            startDate: "2024-11-29",
            endDate: "2024-12-02",
            category: "Especial",
            isActive: false,
            createdAt: "2024-10-01",
        },
    ])

    const [newCoupon, setNewCoupon] = useState({
        code: "",
        type: "percentage",
        value: "",
        minAmount: "",
        maxDiscount: "",
        usageLimit: "",
        expiresAt: "",
    })

    const [newOffer, setNewOffer] = useState({
        name: "",
        description: "",
        discount: "",
        startDate: "",
        endDate: "",
        category: "",
    })

    const handleCreateCoupon = () => {
        if(!newCoupon.code || !newCoupon.value)return

        const coupon={
            id: Date.now().toString(),
            code: newCoupon.code.toUpperCase(),
            type: newCoupon.type,
            value: parseFloat(newCoupon.value),
            minAmount: newCoupon.minAmount ? parseFloat(newCoupon.minAmount) : undefined,
            maxDiscount: newCoupon.maxDiscount ? parseFloat(newCoupon.maxDiscount) : undefined,
            usageLimit: newCoupon.usageLimit ? parseInt(newCoupon.usageLimit) : undefined,
            usedCount: 0,
            expiresAt: newCoupon.expiresAt,
            isActive: true,
            createdAt: new Date().toISOString().split("T")[0],
        }

        setCoupons([...coupons,coupon])
        setNewCoupon({
            code: "",
            type: "percentage",
            value: "",
            minAmount: "",
            maxDiscount: "",
            usageLimit: "",
            expiresAt: "",
        })
    }

    const handleCreateOffer = () => {
        if(!newOffer.name || !newOffer.discount || !newOffer.startDate || !newOffer.endDate) return

        const offer={
            id: Date.now().toString(),
            name: newOffer.name,
            description: newOffer.description,
            discount: parseFloat(newOffer.discount),
            startDate: newOffer.startDate,
            endDate: newOffer.endDate,
            category: newOffer.category,
            isActive: true,
            createdAt: new Date().toISOString().split("T")[0],
        }

        setOffers([...offers, offer])
        setNewOffer({
            name: "",
            description: "",
            discount: "",
            startDate: "",
            endDate: "",
            category: "",
        })
    }

    const toggleCouponStatus =  (id) =>{
        setCoupons(coupons.map((coupon) => (coupon.id === id ? { ...coupon, isActive: !coupon.isActive } : coupon)))
    }

    const toggleOfferStatus  = (id) =>{
        setOffers(offers.map((offer) => (offer.id === id ? { ...offer, isActive: !offer.isActive } : offer)))
    }

    const deleteCoupon  = (id) =>{
        setCoupons(coupons.filter((coupon) => coupon.id !== id))
    }

    const deleteOffer = (id) =>{
        setOffers(offers.filter((offer) => offer.id !== id))
    }

    return(
        <div className="container mx-auto p-6 max-w-6xl">
            <Tabs defaultValue="coupons" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="coupons"  className="flex items-center gap-2">
                        <Tag className="w-4 h-4"/>Cupones de Descuento
                    </TabsTrigger>
                    <TabsTrigger value="offers" className="flex items-center gap-2">
                        <Gift className="w-4 h-4"/>
                        Oferta de Temporada
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="coupons" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="w-5 h-5"/>
                                Crear Nuevo Cupón
                            </CardTitle>
                            <CardDescription>Genera cupones de descuento para tus clientes</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="coupon-code">Código del Cupón</Label>
                                    <Input id="coupon-code" placeholder="ALPACA25" value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}/>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="coupon-type">Tipo de Descuento</Label>
                                    <Select value={newCoupon.type} onValueChange={(value) => setNewCoupon({ ...newCoupon, type: value })} >
                                            {/* <SelectTrigger>
                                                <SelectValue/>
                                            </SelectTrigger>*/
                                            }
                                        <SelectContent>
                                            <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                                            <SelectItem value="fixed">Monto Fijo ($)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div  className="space-y-2">
                                    <Label htmlFor="coupon-value">Valor {newCoupon.type === "percentage" ? "(%)" : "($)"}</Label>
                                    <Input id="coupon-value" type="number" placeholder={newCoupon.type === "percentage" ? "20" : "10"} value={newCoupon.value} onChange={(e) => setNewCoupon({ ...newCoupon, value: e.target.value })}/>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="min-amount">Compra Mínima ($)</Label>
                                    <Input id="min-amount" type="number" placeholder="100" value={newCoupon.minAmount} onChange={(e) => setNewCoupon({ ...newCoupon, minAmount: e.target.value })}/>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="max-discount">Descuento Máximo ($)</Label>
                                    <Input id="max-discount" type="number" placeholder="50" value={newCoupon.maxDiscount} onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: e.target.value })}/>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="usage-limit">Límite de Uso</Label>
                                    <Input id="usage-limit" type="number" placeholder="100" value={newCoupon.usageLimit} onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="expires-at">Fecha de Expiración</Label>
                                    <Input id="expires-at" type="date" value={newCoupon.expiresAt} onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}/>
                                </div>
                            </div>
                            <Button onClick={handleCreateCoupon} className="w-full md:w-auto flex items-center gap-2">
                                <Plus  className="w-4 h-4"/>
                                Crear Cupón
                            </Button>
                        </CardContent>
                    </Card>
                    
                    {/* Lista de Cupones */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Cupones Existentes</CardTitle>
                            <CardDescription>Gestiona todos los cupones de descuento</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {coupons.map((coupon) => (
                                    <div key={coupon.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Badge variant="secondary" className="font-mono">{coupon.code}</Badge>
                                                <Badge className="bg-black text-white" variant={coupon.isActive ? "default" : "secondary"}>{coupon.isActive ? "Activo" : "Inactivo"}</Badge>
                                                <span className="text-sm text-muted-foreground">
                                                    {coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value}`} de descuento
                                                </span>
                                            </div>
                                            <div className="text-sm text-muted-foreground space-y-1">
                                                {coupon.minAmount && <p>Compra mínima: ${coupon.minAmount}</p>}
                                                {coupon.maxDiscount && <p>Descuento máximo: ${coupon.maxDiscount}</p>}
                                                {coupon.usageLimit && (
                                                <p>
                                                    Uso: {coupon.usedCount}/{coupon.usageLimit}
                                                </p>
                                                )}
                                                <p>Expira: {new Date(coupon.expiresAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Switch checked={coupon.isActive} onCheckedChange={() => toggleCouponStatus(coupon.id)} />
                                            <Button variant="outline" size="sm" onClick={() => deleteCoupon(coupon.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>


                <TabsContent value="offers" className="space-y-6"> 
                     {/* Crear Nueva Oferta */}
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Crear Nueva Oferta de temporada
                            </CardTitle>
                            <CardDescription>Crea ofertas especiales para temporadas y eventos</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="offer-name">Nombre de la Oferta</Label>
                                    <Input
                                    id="offer-name"
                                    placeholder="Oferta de Primavera"
                                    value={newOffer.name}
                                    onChange={(e) => setNewOffer({ ...newOffer, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="offer-category">Categoría</Label>
                                    <Select value={newOffer.category} onValueChange={(value) => setNewOffer ({...newOffer, category: value})}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Abrigo">Abrigo</SelectItem>
                                            <SelectItem value="Saco">Saco</SelectItem>
                                            <SelectItem value="Casaca">Casaca</SelectItem>
                                            <SelectItem value="Sueter">Sueter</SelectItem>
                                            <SelectItem value="Cardigan">Cardigan</SelectItem>
                                            <SelectItem value="Chaleco"> Chaleco</SelectItem>
                                            <SelectItem value="Poncho">Poncho</SelectItem>
                                            <SelectItem value="Capa">Capa</SelectItem>
                                            <SelectItem value="Estola">Estola</SelectItem>
                                            <SelectItem value="Gorro">Gorro</SelectItem>
                                            <SelectItem value="Guantes">Guantes</SelectItem>
                                            <SelectItem value="Llavero">Llavero</SelectItem>
                                            <SelectItem value="Peluche">Peluche</SelectItem>
                                            <SelectItem value="Manta">Manta</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="offer-discount">Descuento (%)</Label>
                                    <Input
                                    id="offer-discount"
                                    type="number"
                                    placeholder="25"
                                    value={newOffer.discount}
                                    onChange={(e) => setNewOffer({ ...newOffer, discount: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="start-date">Fecha de Inicio</Label>
                                    <Input
                                    id="start-date"
                                    type="date"
                                    value={newOffer.startDate}
                                    onChange={(e) => setNewOffer({ ...newOffer, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end-date">Fecha de Fin</Label>
                                    <Input
                                    id="end-date"
                                    type="date"
                                    value={newOffer.endDate}
                                    onChange={(e) => setNewOffer({ ...newOffer, endDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="offer-description">Descripción</Label>
                                <Textarea
                                id="offer-description"
                                placeholder="Describe los detalles de la oferta..."
                                value={newOffer.description}
                                onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                                />
                            </div>
                            <Button onClick={handleCreateOffer} className="w-full md:w-auto flex items-center gap-2">
                                <Plus className="w-4 h-4 mr-2"/>
                                Crear Oferta
                            </Button>
                        </CardContent>
                     </Card>

                     {/* Lista de Ofertas */}
                     <Card>
                        <CardHeader>
                            <CardTitle>Ofertas de Temporada</CardTitle>
                            <CardDescription>Gestiona todas las ofertas especiales</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {offers.map((offer) =>(
                                    <di key={offer.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex-1">
                                            <div  className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold">{offer.name}</h3>
                                                <Badge className="bg-black text-white" variant={offer.isActive ? "default" : "secondary"}>
                                                    {offer.isActive ? "Activa" : "Inactiva"}
                                                </Badge>
                                                <Badge className="bg-gray-100 flex items-center" variant="outline">
                                                    <Percent className="w-3 h-3 mr-1" />
                                                    {offer.discount}%
                                                </Badge>
                                                <Badge className="bg-gray-100" variant="outline">{offer.category}</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">{offer.description}</p>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                <CalendarDays className="w-4 h-4" />
                                                {new Date(offer.startDate).toLocaleDateString()} -{" "}
                                                {new Date(offer.endDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Switch checked={offer.isActive} onCheckedChange={() => toggleOfferStatus(offer.id)} />
                                            <Button variant="outline" size="sm" onClick={() => deleteOffer(offer.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </di>
                                ))}
                            </div>
                        </CardContent>
                     </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
