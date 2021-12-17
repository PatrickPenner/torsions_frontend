const path = require('path')
const { TorsionAnalyzerWrapper } = require('../src/TorsionAnalyzerWrapper')

const test_mol_path = path.join('src', 'test_files', '5j1r_hits.sdf')
const test_torsion_output = path.join('src', 'test_files', 'output.tsv')

describe('TorsionAnalyzerWrapper', function () {
  it('reads molecules', function () {
    const molecules = TorsionAnalyzerWrapper.readMolecules(test_mol_path)
    expect(molecules.length).toEqual(20)
    expect(molecules[0].entryId).toBeDefined()
    expect(molecules[0].molString).toBeDefined()
    expect(molecules[0].fileType).toBeDefined()
    expect(molecules[0].name).toBeDefined()
    expect(molecules[0].torsionResults).toBeDefined()
  })

  it('initializes the smarts to ID map', async function () {
    const torsionAnalyzerWrapper = new TorsionAnalyzerWrapper('./')
    await torsionAnalyzerWrapper.initializedPromise
    expect(torsionAnalyzerWrapper.smartsToId.get('[*:1]~[CX4:2]!@[n:3]~[*:4]')).toEqual(0)
    expect(torsionAnalyzerWrapper.smartsToId.size).toEqual(509)
  })

  it('parses torsion data', async function () {
    const torsionAnalyzerWrapper = new TorsionAnalyzerWrapper('./')
    await torsionAnalyzerWrapper.initializedPromise
    const molecules = TorsionAnalyzerWrapper.readMolecules(test_mol_path)
    torsionAnalyzerWrapper.parseTorsionData(test_torsion_output, molecules)
    expect(molecules[0].torsionResults.length).toEqual(3)
  })
})
