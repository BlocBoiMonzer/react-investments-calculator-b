import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import NumberInput from '/components/NumberInput'
 
const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [dollarsPerMonth, setDollarsPerMonth] = useState(200)
  const [interestRatePercentage, setInterestRatePercentage] = useState(12)
  const [interestRate, setInterestRate] = useState(interestRatePercentage / 100)
  const [yearsInvested, setYearsInvested] = useState(0)
  const [lowerAge, setLowerAge] = useState(30)
  const [upperAge, setUpperAge] = useState(65)
  const [finalAge, setFinalAge] = useState(70)

  useEffect(() => {
    setYearsInvested(upperAge - lowerAge)
    setInterestRate(interestRatePercentage / 100)
  }, [upperAge, lowerAge, interestRatePercentage])

  const amountPerYear = []
  for (let i = 0; i < yearsInvested; i++){

    const previousYearAmtPlusInterest = amountPerYear.length > 0 ? amountPerYear[i - 1] * (interestRate+1) : 0
    const amount = dollarsPerMonth * 12 + previousYearAmtPlusInterest; 

    amountPerYear.push( amount )
  }
  
  // If final age is greater than upperage, push the difference to arrray 
  // Add on to the array the values for ages where money is no longer being invested
  if (finalAge > upperAge) {
    for (let i = upperAge; i < finalAge; i++){
      const previousYearAmtPlusInterest = amountPerYear.length > 0 ? amountPerYear[i - lowerAge - 1] * (interestRate + 1) : 0
      const amount = previousYearAmtPlusInterest; 
  
      amountPerYear.push( amount )
    }
    
  }


  return (
    <>
      <Head>
        <title>Investment Calculator</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} p-6`}>
        <div>
          <h1 className="text-center text-2xl">Investment Calculator</h1>

          <NumberInput 
            labelValue={'Amount invested every month: '}
            defaultValue={dollarsPerMonth}
            changeEventHandler={setDollarsPerMonth}
            displayValue={dollarsPerMonth}
          />

          <div>(The average rate of return of the S&P 500 is ~11.8%)</div>

          <NumberInput
            labelValue={'Interest rate (%): '}
            defaultValue={interestRatePercentage}
            changeEventHandler={setInterestRatePercentage}
            displayValue={interestRate}
          />

          <div>
            <label>
              I&apos;m investing from age{' '} 
              <input  
                className="bg-slate-800 text-white"
                value={lowerAge}
                onChange={(e) => {
                  setLowerAge(Number(e.target.value))
                  setYearsInvested(upperAge - lowerAge)
                }}
              />
              {' '}to age{' '}
              <input  
                className="bg-slate-800 text-white"
                value={upperAge}
                onChange={(e) => {
                  setUpperAge(Number(e.target.value))
                }}
              />,
            </label>
            <div>which makes {yearsInvested} years of investing.</div>
          </div>

          <NumberInput
            labelValue={'Show amounts until age: '}
            defaultValue={finalAge}
            changeEventHandler={setFinalAge}
          /> 

          {/* Total Amount Display */}
          <div className="bg-slate-200 text-black p-1 my-4">Total amount earned by age {finalAge}: ${Math.floor(amountPerYear[amountPerYear.length - 1])}</div>

          <div className="columns-3">
            Amount per year: {
              amountPerYear.map((value, index) => {
                return(
                  <>
                    <div>
                      <div>
                        Year {index + 1}, age {Number(lowerAge) + index + 1}:
                      </div>
                      <div>
                        {Math.floor(value)}
                      </div>
                    </div>
                  </>
                )
              })
            }
          </div>
        </div>
      </main>
    </>
  )
}
