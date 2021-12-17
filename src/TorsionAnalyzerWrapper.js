// const fs = require('fs');
// const path = require('path');
const os = require('os')
const fsPromises = fs.promises
const { execSync } = require('child_process')

class TorsionAnalyzerWrapper {
  constructor (baseDir) {
    this.baseDir = baseDir
    const mappingPath = path.join(this.baseDir, 'torsion_lib', 'mapping.tsv')
    this.smartsToId = new Map()
    this.initializedPromise = fsPromises.readFile(mappingPath, 'utf-8')
      .then((mappingData) => {
        mappingData.split('\n').forEach((line) => {
          if (line.length === 0) {
            return
          }
          const splitLine = line.split('\t')
          const id = parseInt(splitLine[0])
          const smarts = splitLine[1]
          this.smartsToId.set(smarts, id)
        })
      })
  }

  async call (inputPath) {
    const tmpPath = fs.mkdtempSync(path.join(os.tmpdir(), 'torsion-'))
    const tmpFilePath = path.join(tmpPath, 'output.tsv')
    const args = [
      '--input', inputPath,
      '--output', tmpFilePath,
      '--torlib ', path.join(this.baseDir, 'torsion_lib', 'tor_lib.xml')
    ]

    const command = path.join(this.baseDir, 'bin', 'TorsionAnalyzer') + ' ' + args.join(' ')
    console.log(command)
    let stdout
    try {
      stdout = execSync(command)
    } catch (error) {
      console.log(`exec error: ${error}`)
      return
    }
    if (stdout && stdout.length > 0) {
      console.log(new TextDecoder('utf-8').decode(stdout))
    }

    const molecules = TorsionAnalyzerWrapper.readMolecules(inputPath)
    this.parseTorsionData(tmpFilePath, molecules)

    return molecules
  }

  static readMolecules (inputPath) {
    const moleculeData = fs.readFileSync(inputPath, 'utf-8')
    const molecules = []
    let entry = 0
    moleculeData.split('$$$$\n').forEach(function (molString) {
      if (molString.length === 0) {
        return
      }
      const name = molString.split('\n')[0]
      molecules.push({
        id: entry,
        entryId: entry,
        molString: molString,
        fileType: 'sdf',
        name: name,
        torsionResults: []
      })
      entry++
    })
    return molecules
  }

  parseTorsionData (tmpFilePath, molecules) {
    const torsionData = fs.readFileSync(tmpFilePath, 'utf-8')
    let id = 0
    // slice 1 to remove header
    torsionData.split('\n').slice(1).forEach((line) => {
      if (line.length === 0) {
        return
      }
      const splitLine = line.split('\t')
      const entry = parseInt(splitLine[0])
      const torsionResult = {
        id: id,
        atomId1: parseInt(splitLine[2]),
        atomId2: parseInt(splitLine[3]),
        atomId3: parseInt(splitLine[4]),
        atomId4: parseInt(splitLine[5]),
        angle: parseFloat(splitLine[6]),
        quality: splitLine[7],
        patternHierarchy: splitLine[8]
      }
      id++
      const smarts = torsionResult.patternHierarchy.split('|')[0]
      let smartsId
      if (!this.smartsToId.has(smarts)) {
        console.error('Could not find: ' + smarts)
      } else {
        smartsId = this.smartsToId.get(smarts)
        torsionResult.torsionPattern = {
          id: smartsId,
          smarts: smarts,
          csdPlotPath: path.join(this.baseDir, 'torsion_lib', 'csd', smartsId + '.svg'),
          pdbPlotPath: path.join(this.baseDir, 'torsion_lib', 'pdb', smartsId + '.svg')
        }
      }
      molecules[entry].torsionResults.push(torsionResult)
    })
  }
}

try {
  exports.TorsionAnalyzerWrapper = TorsionAnalyzerWrapper
} catch (e) {
  // not a module
}
