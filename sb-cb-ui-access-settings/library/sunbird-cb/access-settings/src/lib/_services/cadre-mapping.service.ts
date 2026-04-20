import { Injectable } from "@angular/core";
interface CivilServiceData {
  civilServiceType: {
    civilServiceTypeList: Array<{
      id: string;
      name: string;
      serviceList: Array<{
        id: string;
        name: string;
        commonBatchStartYear: number;
        commonBatchEndYear: number;
        cadreList?: Array<{
          id: string;
          name: string;
          startBatchYear: number;
          endBatchYear: number;
        }>;
      }>;
    }>;
  };
}

@Injectable({
  providedIn: "root",
})
export class CadreMappingService {
  private allCadres = new Map<string, any>();
  private allServices = new Map<string, any>();
  private cadreToServiceMap = new Map<string, Set<string>>();
  private serviceToCadresMap = new Map<string, Set<string>>();
  private batchYearToCadresMap = new Map<number, Set<string>>();
  private batchYearToServicesMap = new Map<number, Set<string>>();

  private cadreConfigData: CivilServiceData | null = null;

  private addToMapSet(map: Map<any, Set<any>>, key: any, value: any) {
    if (!map.has(key)) {
      map.set(key, new Set());
    }
    map.get(key)?.add(value);
  }

  initialize(data: CivilServiceData) {
    // Clear existing data
    this.allCadres.clear();
    this.allServices.clear();
    this.cadreToServiceMap.clear();
    this.serviceToCadresMap.clear();
    this.batchYearToCadresMap.clear();
    this.batchYearToServicesMap.clear();

    // Build lookups
    data?.civilServiceType?.civilServiceTypeList.forEach(cst => {
      if (cst) {
        cst.serviceList.forEach(service => {
          const { id: serviceId, commonBatchStartYear, commonBatchEndYear } = service;
          this.allServices.set(serviceId, service);

          // Add years to service-batch map
          for (let y = commonBatchStartYear; y <= commonBatchEndYear; y++) {
            this.addToMapSet(this.batchYearToServicesMap, y, serviceId);
          }

          service.cadreList?.forEach(cadre => {
            const { id: cadreId, startBatchYear, endBatchYear } = cadre;
            this.allCadres.set(cadreId, cadre);

            // Map cadre <-> service
            this.addToMapSet(this.cadreToServiceMap, cadreId, serviceId);
            this.addToMapSet(this.serviceToCadresMap, serviceId, cadreId);

            // Add years to cadre-batch map
            for (let y = startBatchYear; y <= endBatchYear; y++) {
              this.addToMapSet(this.batchYearToCadresMap, y, cadreId);
            }
          });
        });
      }
    });
  }

  getAllBatchYears(): number[] {
    return Array.from(this.batchYearToCadresMap.keys()).sort((a, b) => a - b);
  }

  getAllCadres(): Array<{ id: string; name: string }> {
    return Array.from(this.allCadres.values()).map(c => ({
      id: c.id,
      name: c.name
    }));
  }

  getAllServices(): Array<{ id: string; name: string }> {
    return Array.from(this.allServices.values()).map(s => ({
      id: s.id,
      name: s.name
    }));
  }

  getServicesByCadres(cadreIds: string[]): Array<{ id: string; name: string }> {
    const serviceIdsSet = new Set<string>();
    cadreIds.forEach(cadreId => {
      const services = this.cadreToServiceMap.get(cadreId) || new Set();
      services.forEach(serviceId => serviceIdsSet.add(serviceId));
    });

    return Array.from(serviceIdsSet).map(id => {
      const s = this.allServices.get(id);
      return { id: s.id, name: s.name };
    });
  }

  getCadresByServices(serviceIds: string[]): Array<{ id: string; name: string }> {
    const cadreIdsSet = new Set<string>();
    serviceIds.forEach(serviceId => {
      const cadres = this.serviceToCadresMap.get(serviceId) || new Set();
      cadres.forEach(cadreId => cadreIdsSet.add(cadreId));
    });

    return Array.from(cadreIdsSet).map(id => {
      const c = this.allCadres.get(id);
      return { id: c.id, name: c.name };
    });
  }

  getCadresByBatchYears(years: number[]): Array<{ id: string; name: string }> {
    const cadreIdsSet = new Set<string>();
    years.forEach(year => {
      const cadres = this.batchYearToCadresMap.get(year) || new Set();
      cadres.forEach(cadreId => cadreIdsSet.add(cadreId));
    });

    return Array.from(cadreIdsSet).map(id => {
      const c = this.allCadres.get(id);
      return { id: c.id, name: c.name };
    });
  }

  getServicesByBatchYears(years: number[]): Array<{ id: string; name: string }> {
    const serviceIdsSet = new Set<string>();
    years.forEach(year => {
      const services = this.batchYearToServicesMap.get(year) || new Set();
      services.forEach(serviceId => serviceIdsSet.add(serviceId));
    });

    return Array.from(serviceIdsSet).map(id => {
      const s = this.allServices.get(id);
      return { id: s.id, name: s.name };
    });
  }

  getServicesByCadresAndBatch(cadreIds: string[], years: number[]): Array<{ id: string; name: string }> {
  const services = this.getServicesByCadres(cadreIds);
  if (!Array.isArray(years)) {
    years = [years];
  }
  return services.filter(service => {
    const fullService = this.allServices.get(service.id);
    // Return true if any year is within the service's batch year range
    return years.some(year => year >= fullService.commonBatchStartYear && year <= fullService.commonBatchEndYear);
  });
}

  getCadresByServicesAndBatch(serviceIds: string[], years: number[]): Array<{ id: string; name: string }> {
    const cadres = this.getCadresByServices(serviceIds);
    if (!Array.isArray(years)) {
      years = [years];
    }
    return cadres.filter(cadre => {
      const fullCadre = this.allCadres.get(cadre.id);
      // Return true if any year is within the cadre's batch year range
      return years.some(year => year >= fullCadre.startBatchYear && year <= fullCadre.endBatchYear);
    });
  }

  getBatchYearsByCadres(cadreIds: string[]): number[] {
    const batchYearsSet = new Set<number>();
    cadreIds.forEach(cadreId => {
      const cadre = this.allCadres.get(cadreId);
      if (cadre) {
        for (let y = cadre.startBatchYear; y <= cadre.endBatchYear; y++) {
          batchYearsSet.add(y);
        }
      }
    });
    return Array.from(batchYearsSet).sort((a, b) => a - b);
  }

  getBatchYearsByServices(serviceIds: string[]): number[] {
    const batchYearsSet = new Set<number>();
    serviceIds.forEach(serviceId => {
      const service = this.allServices.get(serviceId);
      if (service) {
        for (let y = service.commonBatchStartYear; y <= service.commonBatchEndYear; y++) {
          batchYearsSet.add(y);
        }
      }
    });
    return Array.from(batchYearsSet).sort((a, b) => a - b);
  }

  getBatchYearsByServicesAndCadres(serviceIds: string[], cadreIds: string[]): number[] {
    const serviceYears = this.getBatchYearsByServices(serviceIds);
    const cadreYears = this.getBatchYearsByCadres(cadreIds);

    // Find intersection of years
    const commonYears = serviceYears.filter(year => cadreYears.includes(year));
    return commonYears.sort((a, b) => a - b);
  }

  getCadreIdsByName(names: string[]) {
    if (!Array.isArray(names)) names = [names];
    const lowerNames = names.map(n => n.toLowerCase());
    return Array.from(this.allCadres.values())
      .filter(cadre => lowerNames.includes(cadre.name.toLowerCase()))
      .map(cadre => cadre.id);
  }

  getServiceIdsByName(names: string[]) {
    if (!Array.isArray(names)) names = [names];
    const lowerNames = names.map((n) => n.toLowerCase());
    return Array.from(this.allServices.values())
      .filter((service) => lowerNames.includes(service.name.toLowerCase()))
      .map((service) => service.id);
  }

  setCadreConfigData(data: CivilServiceData) {
    this.cadreConfigData = data;
  }

  getCadreConfigData(): CivilServiceData | null {
    return this.cadreConfigData;
  }

  getServicesByNames(names: string[]): Array<{ id: string; name: string }> {
    if (!Array.isArray(names)) names = [names];
    const lowerNames = names.map((n) => n.toLowerCase());
    const uniqueMap = new Map<string, { id: string; name: string }>();
    const cadreConfig = this.getCadreConfigData();
    if (cadreConfig) {
      cadreConfig.civilServiceType.civilServiceTypeList.forEach((cst) => {
        cst.serviceList.forEach((service) => {
          if (lowerNames.includes(service.name.toLowerCase())) {
            if (!uniqueMap.has(cst.id)) {
              uniqueMap.set(cst.id, { id: cst.id, name: cst.name });
            }
          }
        });
      });
    }
    return Array.from(uniqueMap.values());
  }
}
