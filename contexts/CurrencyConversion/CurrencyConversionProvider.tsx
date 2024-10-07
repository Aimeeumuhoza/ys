import React, { useEffect, useState } from 'react'
import useGetCurrencyConversion from '../../hooks/api/useGetCurrencyConversion'
import useHandleState from '../../hooks/useHandleState'
import Currency from '../../lib/enums/currency.enum'
import { getHourDiff } from '../../lib/utils/date.util'
import { numberWithCommas } from '../../lib/utils/formatting.util'
import CurrencyConversionContext from './CurrencyConversionContext'

const CURRENT_CURRENCY_KEY = 'CURRENT_CURRENCY'
const HAS_CHANGED_CURRENCY = 'HAS_CHANGED_CURRENCY'
const LOCATION_UPDATED_DATE_LOCAL_STORAGE_KEY = 'LOCATION_UPDATED_DATE'
const CURRENT_LOCATION_LOCAL_STORAGE_KEY = 'CURRENT_LOCATION'

type CurrencyConversionResponse = {
  base_currency_code: string
  base_currency_name: string
  amount: string
  updated_date: string
  rates: Record<string, CurrencyRates>
  status: string
  error?: {
    code?: string
    message?: string
  }
}

type CurrencyRates = {
  currency_name: string
  rate: string
  rate_for_amount: string
}

/**
 * Context Hook holding currency conversion logic
 * @param props
 */
const CurrencyConversionProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [hasLoadedItemFromCache, setHasLoadedItemFromCache] = useState<boolean>(false)
  const [shouldUpdateLocation, setShouldUpdateLocation] = useState<boolean>()
  const [currentLocation, setCurrentLocation] = useState<string>('N/A')
  const getCurrencyConversionHook = useGetCurrencyConversion()
  const [currentCurrency, setCurrentCurrency] = useState<string>('RWF')
  const [hasChangedCurrency, setHasChangedCurrency] = useState<boolean>()
  const [currentRate, setCurrentRate] = useState(1)

  useEffect(() => {
    try {
      setHasChangedCurrency(JSON.parse(localStorage?.getItem(HAS_CHANGED_CURRENCY) || 'false'))
    } catch (error) {
      setHasChangedCurrency(false)
    }
  }, [])

  useEffect(() => {
    if (!hasLoadedItemFromCache) {
      try {
        setCurrentLocation(
          JSON.parse(localStorage.getItem(CURRENT_LOCATION_LOCAL_STORAGE_KEY) || 'N/A'),
        )
        const locationLastUpdatedAt = JSON.parse(
          localStorage?.getItem(LOCATION_UPDATED_DATE_LOCAL_STORAGE_KEY) || '[]',
        )
        const hourDiff = getHourDiff(new Date(locationLastUpdatedAt), new Date())
        setShouldUpdateLocation(hourDiff > 24)
        setHasLoadedItemFromCache(true)
      } catch (error) {
        setShouldUpdateLocation(true)
        setHasLoadedItemFromCache(true)
      }
    }
  }, [hasLoadedItemFromCache])

  useEffect(() => {
    if (currentCurrency === 'USD') {
      setCurrentRate(1)
      // localStorage?.setItem(CURRENT_CURRENCY_KEY, currentCurrency)
    } else if (currentCurrency && Object.keys(Currency).includes(currentCurrency)) {
      getCurrencyConversionHook.sendRequest(currentCurrency)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCurrency])

  useHandleState<CurrencyConversionResponse>(getCurrencyConversionHook, {
    onSuccess: (response) => {
      const foundCurrencyCode = response.payload.base_currency_code
      const foundRate = parseFloat(response.payload.rates['USD'].rate)
      setCurrentRate(foundRate)
      setCurrentCurrency(foundCurrencyCode)
      // localStorage?.setItem(CURRENT_CURRENCY_KEY, 'RWF')
    },
  })

  const changeCurrencyRate = (currency: Currency): void => {
    localStorage.setItem(HAS_CHANGED_CURRENCY, 'true')
    setHasChangedCurrency(true)
    setCurrentCurrency(currency.toString())
  }

  const changeLocation = (location: string): void => {
    setCurrentLocation(location)
    localStorage.setItem(CURRENT_LOCATION_LOCAL_STORAGE_KEY, location)
    localStorage.setItem(LOCATION_UPDATED_DATE_LOCAL_STORAGE_KEY, JSON.stringify(new Date()))
  }

  const convertTo = (amount: number): string => {
    const convertedAmount = Number((amount / currentRate).toFixed(0))
    return `${numberWithCommas(convertedAmount)} ${currentCurrency}`
  }

  const convertFrom = (amount: string): number => {
    try {
      return Number((parseInt(amount) * currentRate).toFixed(0))
    } catch (error) {
      return 0
    }
  }

  const data = {
    currentRate,
    currentCurrency,
    changeCurrencyRate,
    convertTo,
    convertFrom,
    hasChangedCurrency,
    shouldUpdateLocation,
    currentLocation,
    changeLocation,
  }

  return (
    <CurrencyConversionContext.Provider value={data}>
      {props.children}
    </CurrencyConversionContext.Provider>
  )
}

export default CurrencyConversionProvider
