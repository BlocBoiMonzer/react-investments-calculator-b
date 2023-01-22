import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import NumberInput from '/components/NumberInput'
import FinalAmount from '@/components/FinalAmount'
import BarChart from '@/components/BarChart'
import AmountPerYear from '@/components/AmountPerYear'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [dollarsPerMonth, setDollarsPerMonth] = useState(200)
  const [interestRatePercentage, setInterestRatePercentage] = useState(12)
  const [lowerAge, setLowerAge] = useState(30) //Used in input 
  const [upperAge, setUpperAge] = useState(40) // Used in input 
  const [finalAge, setFinalAge] = useState(65) //hook 7 //used in input 
  const [taxRatePercentage, setTaxRatePercentage] = useState(30)  // used in input 
  
  const interestRateDecimal = interestRatePercentage / 100; 
  const yearsInvested = upperAge - lowerAge
  let amountPerYear = []

  const amountPerYearPlaceholder = [] 

  for (let i = 0; i < yearsInvested; i++){
    console.log('i: ', i)
    const previousYearAmtPlusInterest = amountPerYearPlaceholder.length > 0 ? amountPerYearPlaceholder[i - 1] * (interestRateDecimal+1) : 0
    const amount = dollarsPerMonth * 12 + previousYearAmtPlusInterest; 

    amountPerYearPlaceholder.push( amount )
  }

  amountPerYear = amountPerYearPlaceholder

  // If final age is greater than upperage, push the difference to arrray 
  // Add on to the array the values for ages where money is no longer being invested

  if (finalAge > upperAge) {
    let amountPerYearPlaceholder2 = amountPerYear
    for (let i = upperAge; i < finalAge; i++){
      console.log('i2: ', i)
      const previousYearAmtPlusInterest = amountPerYearPlaceholder2.length > 0 ? amountPerYearPlaceholder2[i - lowerAge - 1] * (interestRateDecimal + 1) : 0
      const amount = previousYearAmtPlusInterest; 
  
      amountPerYearPlaceholder2.push( amount )
    }
    amountPerYear = amountPerYearPlaceholder2
  }

  let annualData = [
  ]

  const annualDataPlaceholder = []

  amountPerYear.forEach((value, index, array) => {
    console.log('i3:', index)
    annualDataPlaceholder.push({x: index + lowerAge + 1, y: value})
    console.log(annualData)
  })

  annualData = annualDataPlaceholder

  const taxRateDecimal = taxRatePercentage / 100; 
  const finalAmount = amountPerYear[amountPerYear.length - 1]; 
  const annualIncomeAfterTaxes = finalAmount*interestRateDecimal * (1 - taxRateDecimal); 

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
          <h1 className="text-center text-2xl mb-4 font-light">Investment Calculator</h1>
          <p className="font-extralight text-lg">Calculate the future value of a monthly investment you make for a number of years.</p>

          <NumberInput 
            labelValue={'Monthly investment ($): '}
            defaultValue={dollarsPerMonth}
            changeEventHandler={setDollarsPerMonth}
            inputName={'monthly-investment'}
          />

          <NumberInput
            labelValue={'Average interest rate (%): '}
            subheading={'(The average rate of return of the S&P 500 is ~11.8%)'}
            defaultValue={interestRatePercentage}
            changeEventHandler={setInterestRatePercentage}
            inputName={'interest-rate'}
          />

          <NumberInput
            labelValue={'Age I start investing:'}
            defaultValue={lowerAge}
            changeEventHandler={setLowerAge}
            inputName={'start-age'}
          />

          <NumberInput
            labelValue={'Age I stop investing:'}
            subheading={"(The age you stop putting in your monthly investment)}"}
            defaultValue={upperAge}
            changeEventHandler={setUpperAge}
            inputName={'end-age'}
          />
          <div className="text-center font-extralight mt-6 text-lg">(Total of <span className="underline">{yearsInvested}</span> years of investing.)</div>

          <NumberInput
            labelValue={'Age I start withdrawing: '}
            defaultValue={finalAge}
            changeEventHandler={setFinalAge}
            inputName={'final-age'}
          /> 

          {/* Total Amount Display */}
          <div className="mt-14 mb-16">
            <FinalAmount 
              amount={finalAmount}
              text={`Total amount earned by age ${finalAge}:`}
            /> 
            <FinalAmount 
              amount={finalAmount*interestRateDecimal}
              text={`My annual income at ${interestRatePercentage}% per year of this total is: `}
            /> 

            <NumberInput
              labelValue={'Amount of taxes I will pay on my investment when I withdraw (%):'}
              defaultValue={taxRatePercentage}
              changeEventHandler={setTaxRatePercentage}
              inputName={'final-age'}
            /> 

            <FinalAmount 
              amount={finalAmount*interestRateDecimal * (1 - taxRateDecimal)}
              text={`After ${taxRateDecimal * 100}% to taxes, I am taking home this much per year:`}
            /> 
            <FinalAmount 
              amount={annualIncomeAfterTaxes / 12}
              text={"This makes this much per month:"}
            /> 
          </div>

          <BarChart 
            lowerAge={lowerAge}
            finalAge={finalAge}
            annualData={annualData}
            amountPerYear={amountPerYear}
          />

          <AmountPerYear 
            amountPerYear={amountPerYear} 
            interestRatePercentage={interestRatePercentage}
            yearsInvested={yearsInvested}
            dollarsPerMonth={dollarsPerMonth}
            lowerAge={lowerAge}
          /> 
          
        </div>
        <div>
          <h2 className="text-center">Some Tips</h2>
          <ul className="list-disc">
            <li>
              <div>
                <p>
                  Investing $200 a month from age 30 to age 40 will yield about $715k by age 65. This amount of money will earn an average of $85k per year at 12% (the market average rate of return). 
                </p>
                <p className="mt-4">
                  That means you will have an income of $85k every year minus taxes. If we subtract 30%, that leaves ${Math.floor(85 * 0.7)}k. You would never have to work or invest again, and you will be able to pull out ${Math.floor(85 * 0.7)}k every year for the rest of your life. Even if you were to live to 1,000,000 years old.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </main>
    </>
  )
}
