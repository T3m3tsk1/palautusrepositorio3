const Header = ({ name }) => {
  return (
    <>
      <h1>{name}</h1>
    </>
  )
}

const Part = ({ text, exercises }) => {
  return (
    <>
      <p>
        {text} {exercises}
      </p>
    </>
  )
}

const Content = ({ parts }) => {
  return (
    <>
      {parts.map(part => 
        <Part key={part.id} text={part.name} exercises={part.exercises} />
      )}
    </>
  )
}

const Total = ({ parts }) => {
  const total = parts.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.exercises
  }, 0)
  
  return (
    <>
      <h4>Total of {total} exercises</h4>
    </>
  )
}

const Course = ({ course }) => {
  return (
    <>
      <Header name={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </>
  )
}

export default Course