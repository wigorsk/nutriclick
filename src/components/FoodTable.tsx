import { useState } from "react"
import { Popup } from "./popup"
import { api } from "@/app/utils/api"

type Props = {
    user_id: number,
    meal_time: string,
    id: number,
    refreshTable: () => void,
    foodName: string,
    calorias: number,
    gramas: number,
    carboidratos: number,
    gorduras: number,
    proteinas: number,
}   

const basis = 'basis-20 md:basis-28 lg:basis-44'


export const FoodTable = ({ user_id, meal_time, id, refreshTable, foodName, calorias, gramas, carboidratos, gorduras, proteinas }:Props) => {

    const [popup, setPopup] = useState<boolean>(false)

    const [newGrams, setNewGrams] = useState<number>(gramas)

    const regra3 = (macro: number) => {
        return (macro * newGrams) / gramas
    }

    const handleClickButton = () => {
        setPopup(!popup)
        setNewGrams(gramas)
    }

    const handleEditButton = async () => {
        try {
            const response = await api.put('/user/consume/', {
                id: id,
                gramas: newGrams
            })

            console.log(response)
        } catch (error) {
            console.log(error)
        }

        refreshTable()
        setPopup(!popup)
    }

    const handleDeleteButton = async () => {
        console.log(meal_time)
        try {
            const response = await api.delete('/user/consume/', {
                data: {
                    id,
                    meal_time
                }
            })
                console.log(response)
                
            } catch (error) {
                console.log(error)
            }

            refreshTable()
            setPopup(!popup)
    }

    return (
        <>
            <tr className="py-2 flex items-center text-center bg-neutral-300 text-neutral-950">
                <td className="flex-1 text-start ml-5 md:ml-10 text-xs sm:text-sm md:text-base ">
                    <button onClick={handleClickButton} className="underline">{foodName}, {gramas}g</button>
                    </td>
                <td className={`${basis}`}>{calorias}</td>
                <td className={`${basis}`}>{carboidratos}</td>
                <td className={`${basis}`}>{gorduras}</td>
                <td className={`${basis}`}>{proteinas}</td>
            </tr>

            {popup &&
                <Popup onClick={() => setPopup(!popup)}>
                    <div>
                        <p className="font-bold text-3xl capitalize">{foodName}</p>
                        
                        <div className="mb-4">
                            <label htmlFor="grams" className="italic text-sm">Quantidade em gramas:</label>
                            <input 
                            id="grams"
                            type="number"
                            value={newGrams == 0 ? '' : newGrams}
                            onChange={e => setNewGrams(Number(e.target.value))}
                            className='w-full outline-none py-1 mb-2 rounded-lg px-2 typeNumber placeholder:text-black/30'
                            />

                            <ul className="flex flex-col text-sm">
                                <li>Carboidratos: {regra3(carboidratos).toFixed(2)}g</li>
                                <li>Gorduras: {regra3(gorduras).toFixed(2)}g</li>
                                <li>Proteínas: {regra3(proteinas).toFixed(2)}g</li>
                            </ul>
                            
                        </div>

                        <button 
                            onClick={handleEditButton}
                            className='bg-blue-900 px-4 py-2 mr-2 rounded-lg text-white font-bold'
                                >Salvar
                        </button>

                        <button 
                            onClick={handleDeleteButton}
                            className='bg-red-900 px-4 py-2 rounded-lg text-white font-bold'
                            >Deletar
                        </button>
                    </div>
                </Popup>
            }

        </>
    )
}