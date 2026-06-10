import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

function RegisterFormPatient() {
    const [formData, setFormData] = useState({
        fullName: "",
        gender: "",
        birthdate: "",
        cpf: "",
        rg: "",
        maritalStatus: "",
        phone: "",
        email: "",
        birthplace: "",
        emergencyContact: "",
        allergies: "",
        specialCare: "",
        healthInsurance: "",
        insuranceNumber: "",
        insuranceValidity: "",
        address: {
            cep: "",
            city: "",
            state: "",
            street: "",
            number: "",
            complement: "",
            neighborhood: "",
            reference: ""
        }
    })

    const [isSaving, setIsSaving] = useState(false)

    // handles

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value })) //operador spread e propriedade computada
    }

    const handleAddressChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            address: { ...prev.address, [name]: value }
        })) //operador spread e propriedade computada
    }

    // requisição para api viacep 

    const fetchAddressData = async (cep) => {
        try {
            const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json`)
            setFormData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    cep: data.cep || "",
                    city: data.localidade || "",
                    state: data.uf || "",
                    street: data.logradouro || "",
                    complement: data.complemento || "",
                    neighborhood: data.bairro || ""
                }
            }))

        } catch (error) {
            console.log("Erro ao buscar endereço", error)
        }
    }

    // tratamento do valor digitado no campo de cep

    const handleCepBlur = (e) => {
        const cep = e.target.value.replace(/\D/g, "")
        if (cep.length === 8) fetchAddressData(cep)

    }

    //submit form

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            await axios.post("http://localhost:3000/patients", formData)

            toast.success("Paciente cadastrado com sucesso!", {
                autoClose: 2000,
                hideProgressBar: true
            })

            setFormData({
                fullName: "",
                gender: "",
                birthdate: "",
                cpf: "",
                rg: "",
                maritalStatus: "",
                phone: "",
                email: "",
                birthplace: "",
                emergencyContact: "",
                allergies: "",
                specialCare: "",
                healthInsurance: "",
                insuranceNumber: "",
                insuranceValidity: "",
                address: {
                    cep: "",
                    city: "",
                    state: "",
                    street: "",
                    number: "",
                    complement: "",
                    neighborhood: "",
                    reference: ""
                }
            })

        } catch (error) {
            console.error(error)
            toast.error("Erro ao Salvar os dados!", {
                autoClose: 2000,
                hideProgressBar: true
            })
        }
    }


    return (
        <form
            onSubmit={handleSubmit}
            className='space-y-6 text-gray-800'
            autoComplete='off'
        >

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Nome completo */}
                <fieldset>
                    <label htmlFor='fullName' className='block text-sm font-medium mb-1'>Nome Completo</label>
                    <input
                        type='text'
                        name='fullName'
                        id='fullName'
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>

                <fieldset>


                    <label htmlFor='gender' className='block text-sm font-medium mb-1'>Gênero</label>

                    <select
                        name='gender'
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    >
                        <option value="">Selecione</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="outro">Outro</option>


                    </select>

                </fieldset>

            </div>


        </form>
    )
}

export default RegisterFormPatient