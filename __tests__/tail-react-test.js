const tailReact = require('../lib/tail-react')


test('Confirm file path', async () => {
    // const data = await tailReact.confirm('/home/clown/hamburger')
    // expect(data).toBe(false)

    expect(tailReact.confirm('/home/clown/hamburger'))
    .toBe(0)

    // return tailReact.confirm('/home/clown/hamburger').then(data => {
    //     expect(data)
    //     .toBe(false)
    // })
    // expect(tailReact.confirm('/home/clown/hamburger'))
    // .toBe('[---] The path you entered does not exist.')
})