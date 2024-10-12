'use client'
import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {DateRange} from "react-day-picker";

const Page = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState('')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isLoading, setIsLoading] = useState(false)
    const [time, setTime] = useState<Date>()
    const [fullName, setFullName] = useState('')
    const [number, setNumber] = useState('')
    const [locationFrom, setLocationFrom] = useState('')
    const [locationTo, setLocationTo] = useState('')
    const [role, setRole] = useState('Driver');
    const [name, setName] = useState("")
    const [weight, setWeight] = useState<string>('');
    const [brokerNumber, setBrokerNumber] = useState("")
    const [brokerSecondNumber, setBrokerSecondNumber] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [dateRange, setDateRange] = useState<DateRange | undefined>()
    const [loadReferenceId, setLoadReferenceId] = useState("")
    const [description, setDescription] = useState('');

    const handleClearInput = () => {
        setFullName('');
        setDescription('');
        setLocationFrom('');
        setLocationTo('');
        setNumber('');
        setName('');
        setBrokerNumber('');
        setBrokerSecondNumber('')
        setCompanyName('');
        setLoadReferenceId('');
        setWeight('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = localStorage.getItem('token');
        setError('')
        setIsLoading(true)

        try {
            // const res = await fetch('/api/broking/driver', {
            const res = await fetch('/api/auth/broking/driver', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({fullName, description, number, weight, time, locationFrom, locationTo}),
            })

            const data = await res.json()
            if (!res.ok) {
                setError(data.message || 'An error occurred')
            }
        } catch (error) {
            setError('An error occurred')
        } finally {
            setIsLoading(false)
        }

        handleClearInput();
    }

    return (
        <Card className="w-full max-w-md mx-auto overflow-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Add Driver Data</CardTitle>
            </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex gap-12">
                        <div className="flex flex-col space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullname">Full Name</Label>
                                <Input id="fullname" placeholder="John Doe" required value={fullName}
                                       onChange={(e) => setFullName(e.target.value)}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input id="description" placeholder="Greedy" required value={description}
                                       onChange={(e) => setDescription(e.target.value)}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="number">Driver Number</Label>
                                <Input id="number" type="number" placeholder="123" required value={number}
                                       onChange={(e) => setNumber(e.target.value)}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={`w-full justify-start text-left font-normal ${
                                                !time && "text-muted-foreground"
                                            }`}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4"/>
                                            {time ? format(time, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={time}
                                            onSelect={setTime}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="weight">Weight</Label>
                            <Input id="weight" placeholder="30000" required value={weight}
                                   onChange={(e) => setWeight(e.target.value)}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="from">From</Label>
                            <Input id="from" placeholder="Starting location" required value={locationFrom}
                                   onChange={(e) => setLocationFrom(e.target.value)}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="to">To</Label>
                            <Input id="to" placeholder="Destination" required value={locationTo}
                                   onChange={(e) => setLocationTo(e.target.value)}/>
                        </div>
                        </div>
                        </div>
                        <Button type="submit" className="w-full">Submit</Button>
                    </form>
                </CardContent>
        </Card>
    );
};

export default Page;